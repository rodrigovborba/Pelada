const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    trim: true
  },

  contact: {
    type: String,
    trim: true,
    lowercase: true
  },
  location: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: '../images/deafaultPic.jpg'
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }

});

const Field = mongoose.model('Field', schema);

module.exports = Field;