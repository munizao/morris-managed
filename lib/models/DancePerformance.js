const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  dance: { type : mongoose.Schema.ObjectId, ref : 'Dance' },
  dancers: [{ type : mongoose.Schema.ObjectId, ref : 'Dancer' }],
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  }
});

const model = mongoose.model('DancePerformance', schema);
model.populatedPaths = 'dance dancers';
module.exports = model;
