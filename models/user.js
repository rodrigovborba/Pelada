const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true
  },
  surname: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
},

passwordHash: {
    type: String,
    required: true
}
});

const User = mongoose.model('User', schema);

module.exports = User;

