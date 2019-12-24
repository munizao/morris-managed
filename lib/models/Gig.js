const mongoose = require('mongoose');
const Dancer = require('Dancer');
const Dance = require('Dance');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: Date,
  dances: [Dance],
  dancers: [Dancer]
});

module.exports = mongoose.model('Gig', schema);
