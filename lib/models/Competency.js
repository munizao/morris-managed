const mongoose = require('mongoose');
const AbstractDance = require('./AbstractDance');

const schema = new mongoose.Schema({
  abstractDance: AbstractDance,
  level: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Competency', schema);
