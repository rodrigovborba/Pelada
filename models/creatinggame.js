const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  groupName: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  location: {
    type: String,
    trim: true
  },
  numberOfPlayers: {
    type: Number,
    trim: true,
    required: true
  },
  dayOfPlay: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  },

  time: {
    type: String,
    required: true
  }

});
const Game = mongoose.model('Game', schema);

module.exports = Game;