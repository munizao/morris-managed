const mongoose = require('mongoose');
const Dancer = require('./Dancer');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dances: [{ type : mongoose.Schema.ObjectId, ref : 'Dance' }]
});

schema.virtual('dancers', {
  ref: Dancer,
  localField: '_id',
  foreignField: 'teams'
},
{ id: false, toJSON: { virtuals: true } }
);

const model = mongoose.model('Team', schema);
module.exports = model;
