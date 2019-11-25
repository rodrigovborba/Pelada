const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  groupName: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
},
location: {
    type: String,
    trim: true
  },
  numberOfPlayers: {
    type: Number,
    trim: true
  },
  dayOfPlay: {
    type: String,
    lowercase: true,
    trim: true
  },

  time: {
      type: Number,
      required: true
  }

});
const User = mongoose.model('User', schema);

module.exports = User;

