const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
    required: true
  },
  surname: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  birthdate: {
    type: String
  },
  position: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending Confirmation', 'Active'],
    default: 'Pending Confirmation'
  },
  confirmationCode: {
    type: String
  },

  photo: {
    type: String,
    default: '../images/deafaultPic.jpg'
  }
});

const User = mongoose.model('User', schema);

module.exports = User;