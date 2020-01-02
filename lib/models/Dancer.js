const mongoose = require('mongoose');
const User = require('./User');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  competencies: [{ type : mongoose.Schema.ObjectId, ref : 'Competency' }],
  teams: [{ type : mongoose.Schema.ObjectId, ref : 'Team' }]
});

schema.methods.canUserWrite = async function(user) {
  if(user.role === 'admin')
  {
    return true;
  }
  const populatedUser = await User.findById(user._id).populate('squireOf');
  const squiredTeamIds = populatedUser.squireOf.map(team => team._id.toString());
  const thisDancerTeamIds = this.teams.map(team => team._id.toString());
  const teamIntersection = squiredTeamIds.filter(team => thisDancerTeamIds.includes(team));
  return teamIntersection.length;
};

const model = mongoose.model('Dancer', schema);
model.populatedPaths = 'competencies teams';
module.exports = model;
