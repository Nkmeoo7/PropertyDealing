import mongoose from "mongoose";

const propertySchema = new mongoose.model({

  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    enum: ['availablle', 'sold'],
    default: 'available'
  },
  location: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  //type of propertyType
  bedrooms: {
    type: Number,
    default: 0
  },
  bathrooms: {
    type: Number,
    default: 0
  },

  areaSqFt: {
    type: Number
  },
  //media toLocaleUpperCase(0);

  imageUrls: [{
    type: String //array to hold multiple urls
  }],
  //refer to who listed the Property
  lister: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },




}, { timestamps: true });



const Property = mongoose.model("Property", propertySchema);
export default Property;


