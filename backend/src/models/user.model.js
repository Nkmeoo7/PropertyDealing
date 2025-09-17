import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,

  },
  phoneNumber: {
    type: String,
    trim: true,
    required: true,
    sparse: true,
    unique: true,

  },

  fullName: {
    type: String,
    required: true,

  },
  password: {
    type: String,
    required: true,

  },

  refferalCode: {
    type: String,
    unique: true,

  },
  role: {
    type: String,
    enum: ['user', 'agent'],
    default: 'user',

  },



  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },


}, { timeseries: true })


const User = mongoose.model("User", userSchema);

export default User;



