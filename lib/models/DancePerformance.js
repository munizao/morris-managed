const mongoose = require('mongoose');
const Gig = require('./Gig');


const schema = new mongoose.Schema({
  dance: { type : mongoose.Schema.ObjectId, ref : 'Dance' },
  dancers: [{ type : mongoose.Schema.ObjectId, ref : 'Dancer' }],
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  team: { type : mongoose.Schema.ObjectId, ref : 'team', immutable : true }
});

const model = mongoose.model('DancePerformance', schema);
model.populatedPaths = 'dance dancers';
model.accessBy = 'team';
module.exports = model;
