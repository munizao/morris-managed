const mongoose = require('mongoose');
const DancePerformance = require('./DancePerformance');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: Date,
  team: { type : mongoose.Schema.ObjectId, ref : 'Team' },
  dancers: [{ type : mongoose.Schema.ObjectId, ref : 'Dancer' }]
});

schema.virtual('dancePerformances', {
  ref: DancePerformance,
  localField: '_id',
  foreignField: 'gig'
},
{ id: false, toJSON: { virtuals: true } }
);

const model = mongoose.model('Gig', schema);
model.populatedPaths = 'dancePerformances dancers';
module.exports = model;
