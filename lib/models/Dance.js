//from lab 14

const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tradition: String,
  props: {
    type: String,
    enum: ['sticks', 'hankies']
  },
  figures: [String],
  dancerQuantity: Number
});

module.exports = mongoose.model('Dance', schema);
