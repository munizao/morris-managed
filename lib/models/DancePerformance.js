const mongoose = require('mongoose');
const Gig = require('./Gig');


const schema = new mongoose.Schema({
  dance: { type : mongoose.Schema.ObjectId, ref : 'Dance' },
  dancers: [{ type : mongoose.Schema.ObjectId, ref : 'Dancer' }],
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  }
});

schema.virtual('team').get(async function() {
  const gig = await Gig.findById(this.gig);
  return gig.team;
});

const model = mongoose.model('DancePerformance', schema);
model.populatedPaths = 'dance dancers';
module.exports = model;
