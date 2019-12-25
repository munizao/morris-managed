const mongoose = require('mongoose');
const DancePerformance = require('./DancePerformance');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: Date,
  dancers: [{ type : mongoose.Schema.ObjectId, ref : 'Dancer' }]
});

schema.virtual('dancePerformances', {
  ref: DancePerformance,
  localField: '_id',
  foreignField: 'gig'
},
{ id: false, toJSON: { virtuals: true } }
);


module.exports = mongoose.model('Gig', schema);
