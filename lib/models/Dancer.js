const mongoose = require('mongoose');
const Gig = require('./Gig');
const Competency = require('./Competency');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  gigs: [Gig],
  competencies: [Competency]
});

module.exports = mongoose.model('Dancer', schema);
