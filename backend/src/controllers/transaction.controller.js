import Transaction from '../models/transaction.model.js';
import Property from '../models/property.model.js';
import ReferralReward from '../models/referralReward.model.js';
import User from '../models/user.model.js';
import WelcomeBonus from '../models/welcomeBonus.model.js';



// @desc    A user buys a property
//
// @route   POST /api/transactions/buy/:propertyId
// @access  Private (User only)
export const createTransaction = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const buyerId = req.user.id; // From 'protect' middleware

    // 1. Find the property being purchased
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (property.status === 'sold') {
      return res.status(400).json({ message: 'This property has already been sold' });
    }

    // 2. Create the transaction record
    const newTransaction = await Transaction.create({
      property: propertyId,
      buyer: buyerId,
      agent: property.lister, // The agent is the one who listed the property
      finalPrice: property.price // Or a price from req.body if you allow negotiation
    });

    // 3. CRITICAL: Update the property's status to 'sold'
    property.status = 'sold';
    await property.save();

    const bonus = await WelcomeBonus.findOne({ user: buyerId, status: 'pending' });
    if (bonus) {
      bonus.status = 'activated';
      bonus.activatedAt = Date.now();
      await bonus.save();
      console.log(`Welcome bonus activated for user ${buyerId}`);
    }

    // 2. Check for a referrer and create their reward
    const buyer = await User.findById(buyerId);
    if (buyer && buyer.referrer) {
      await ReferralReward.create({
        referrer: buyer.referrer,
        referredUser: buyerId,
        transaction: newTransaction._id,
        giftType: 'Trip' // Or dynamically assign this
      });
      console.log(`Referral reward created for referrer ${buyer.referrer}`);
    }

    // --- We will add the Bonus & Referral logic here in the next modules ---

    res.status(201).json({
      status: 'success',
      message: 'Transaction completed successfully!',
      data: { transaction: newTransaction }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
