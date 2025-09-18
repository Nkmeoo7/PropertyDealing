import mongoose from "mongoose";

const referralRewardSchema = new mongoose.Schema({
  // The user who gets the gift
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // The user whose purchase triggered the gift
  referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // The specific transaction
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  giftType: { type: String, default: 'Voucher' },
  status: { type: String, enum: ['claimable', 'claimed'], default: 'claimable' },
}, { timestamps: true });

const ReferralReward = mongoose.model("ReferralReward", referralRewardSchema);
export default ReferralReward;
