const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    trim: true
  },
  players: {
    type: String,
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