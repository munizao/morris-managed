const mongoose = require('mongoose');
const Dancer = require('./Dancer');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dances: [{ type : mongoose.Schema.ObjectId, ref : 'Dance' }],
  dancers: [{ type : mongoose.Schema.ObjectId, ref : 'Dancer' }],
  squire: { type : mongoose.Schema.ObjectId, ref : 'User' }
});

// schema.virtual('dancers', {
//   ref: Dancer,
//   localField: '_id',
//   foreignField: 'teams'
// },
// { id: false, toJSON: { virtuals: true } }
// );

//This is hacky becase we're keeping two sets of refs that could get out of sync, but I'll keep it for now. 
schema.post('save', function(doc) {
  doc.dancers.forEach(async function(dancerId) {
    const dancer = await Dancer.findById(dancerId);
    if(!dancer.teams.includes(doc._id)) {
      dancer.teams.push(doc._id);
      await dancer.save();
    }
  });
});

const model = mongoose.model('Team', schema);
module.exports = model;
