const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  dance: { type : mongoose.Schema.ObjectId, ref : 'dance' },
  dancers: [{ type : mongoose.Schema.ObjectId, ref : 'Dancer' }],
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  }
});

module.exports = mongoose.model('DancePerformance', schema);