import mongoose from "mongoose"


export const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  city: {
    type: String,
    required: [true, "please provide city"]
  },
  national: {
    type: String,
    required: [true, "please provide a national"]
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  level: {
    type: String,
    enum: ['junior', 'midlevel', 'senior'],
    required: [true, 'Please provide your experience level'],
  },
  views: [{
    type: mongoose.Types.ObjectId,
    default: []
  }],
  bio: {
    type: String,
    default: "",
    maxlength: 500,
  },
  proglang: {
    type: [String],
    required: [true, "please provide a programming lang"]
  },

})


export default mongoose.model("Customer", CustomerSchema)

