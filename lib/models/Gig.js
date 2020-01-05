const mongoose = require('mongoose');
const Dancer = require('./Dancer');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: Date,
  team: { type : mongoose.Schema.Types.ObjectId, ref : 'Team' },
  dancers: [{ type : mongoose.Schema.Types.ObjectId, ref : 'Dancer' }]
});

schema.methods.canUserWrite = schema.methods.canUserRead = async function(user) {
  const dancer = await Dancer.findById(user.dancer);
  return dancer.teams.includes(this.team);
};

schema.statics.getUserQuery = async function(user) {
  const dancer = await Dancer.findById(user.dancer);
  const query = {};
  query.team = dancer.teams;
  return query;
};

schema.virtual('dancePerformances', {
  ref: 'DancePerformance',
  localField: '_id',
  foreignField: 'gig'
},
{ id: false, toJSON: { virtuals: true } }
);

const model = mongoose.model('Gig', schema);
model.populatedPaths = 'dancePerformances dancers';
model.accessBy = 'team';
module.exports = model;
