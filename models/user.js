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
    required: true,
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
  }

});

const User = mongoose.model('User', schema);

module.exports = User;