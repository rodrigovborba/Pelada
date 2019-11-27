const mongoose = require('mongoose');
const cloudinary = require('cloudinary');

const photoSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    }

},{
    timestamps: {
        createdAt: 'creationDate',
        updatedAt:'updateDate'
    },
    toObject: {
        virtuals: true
      },
      toJSON: {
        virtuals: true
      }
});


const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;