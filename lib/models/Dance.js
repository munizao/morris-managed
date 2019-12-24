const mongoose = require('mongoose');
const AbstractDance = require('./AbstractDance');
const Dancer = require('./Dancer');
const Gig = require('./Gig');

const schema = new mongoose.Schema({
  abstractDance: AbstractDance,
  dancers: [Dancer],
  gig: Gig
});

module.exports = mongoose.model('AbstractDance', schema);
