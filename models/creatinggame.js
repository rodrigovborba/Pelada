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
    type: String,
    required: true
  }

});
const Game = mongoose.model('Game', schema);

module.exports = Game;