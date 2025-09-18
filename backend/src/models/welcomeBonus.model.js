import mongoose from "mongoose";

const welcomeBonusSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  status: { type: String, enum: ['pending', 'activated'], default: 'pending' },
  activatedAt: { type: Date }
});

const WelcomeBonus = mongoose.model("WelcomeBonus", welcomeBonusSchema);
export default WelcomeBonus;
