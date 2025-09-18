import User from '../models/user.model.js';
import mongoose from 'mongoose';

// @desc    Get the user's direct referrer (their "parent")
// @route   GET /api/network/parent
// @access  Private (User/Agent)
export const getParent = async (req, res) => {
  try {
    // The 'protect' middleware has already found the logged-in user for us.
    const user = req.user;

    // Check if the user even has a referrer
    if (!user.referrer) {
      return res.status(200).json({ message: "You don't have a referrer." });
    }

    // Find the parent user and populate their details
    // .populate() is Mongoose's magic for fetching linked documents.
    const populatedUser = await user.populate({
      path: 'referrer',
      select: 'name email' // We only want to show their name and email, not sensitive info
    });

    res.status(200).json({
      status: 'success',
      data: { parent: populatedUser.referrer }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a user's entire referral downline as a tree
// @route   GET /api/network/downline
// @access  Private (User/Agent)
export const getDownline = async (req, res) => {
  try {
    const userId = req.user.id;

    // This is an advanced MongoDB query called an Aggregation Pipeline.
    // It's the most efficient way to query hierarchical data like this.
    const downlineList = await User.aggregate([
      // Stage 1: Start the search from the logged-in user.
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },

      // Stage 2: Use $graphLookup to recursively find all descendants.
      // It's like telling the database: "Start with this user's ID, and follow
      // the chain where one user's '_id' matches another user's 'referrer' field."
      {
        $graphLookup: {
          from: 'users', // The collection to search in
          startWith: '$_id', // The field to start the search from
          connectFromField: '_id', // The field on the "parent" document
          connectToField: 'referrer', // The field on the "child" document
          as: 'downline', // The name of the array where results will be stored
          depthField: 'level' // Optional: Adds a 'level' field (0 for direct referrals, etc.)
        }
      },

      // Stage 3: We only need the downline array, so we project that field.
      { $project: { downline: 1, _id: 0 } }
    ]);

    if (downlineList.length === 0 || downlineList[0].downline.length === 0) {
      return res.status(200).json({ message: "You have not referred any users yet.", tree: [] });
    }

    // Now we need to structure this flat list into a nested tree.
    const flatList = downlineList[0].downline;
    const userMap = {};

    // Create a map for easy lookup
    flatList.forEach(user => {
      userMap[user._id] = { ...user, children: [] };
    });

    const tree = [];
    flatList.forEach(user => {
      // If the user's referrer is the logged-in user, they are a top-level child
      if (String(user.referrer) === String(userId)) {
        tree.push(userMap[user._id]);
      } else if (userMap[user.referrer]) {
        // Otherwise, find their parent in the map and add them as a child
        userMap[user.referrer].children.push(userMap[user._id]);
      }
    });

    res.status(200).json({ tree });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
