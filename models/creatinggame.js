const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  groupName: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  location: {
    type: mongoose.Types.ObjectId,
    ref: 'Field'
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
  },
  players: {
    type: Array
  },
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  }

});
const Game = mongoose.model('Game', schema);

module.exports = Game;