const mongoose = require('mongoose');
const Dancer = require('Dancer');
const Dance = require('Dance');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: Date,
  dancers: [{ type : mongoose.Schema.ObjectId, ref : 'Dancer' }]
});

schema.virtual('dances', {
  ref: Dance,
  localField: '_id',
  foreignField: 'gig'
},
{ id: false, toJSON: { virtuals: true } }
);


module.exports = mongoose.model('Gig', schema);
