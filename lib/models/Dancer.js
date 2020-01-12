const mongoose = require('mongoose');
const User = require('./User');
const Competency = require('./Competency');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  teams: [{ type : mongoose.Schema.Types.ObjectId, ref : 'Team' }]
});

schema.virtual('competencies', {
  ref: 'Competency',
  localField: '_id',
  foreignField: 'dancer'
});

schema.methods.canUserRead = function(user) {
  switch(user.role) {
    case 'admin': {
      return true;
    }
    case 'squire':
    case 'dancer': {
      const dancersByTeams = this.teams.map(team => team.dancers);
      return dancersByTeams.flat().includes(user.dancer._id);
    }
    default:
    {
      return false;
    }
  }
};

schema.methods.canUserWrite = async function(user) {
  switch(user.role) {
    case 'admin': {
      return true;
    }
    case 'squire': {
      const populatedUser = await User.findById(user._id).populate('squireOf');
      const squiredTeamIds = populatedUser.squireOf.map(team => team._id.toString());
      const thisDancerTeamIds = this.teams.map(team => team._id.toString());
      const teamIntersection = squiredTeamIds.filter(team => thisDancerTeamIds.includes(team));
      return !!teamIntersection.length;
    }
    case 'dancer':
    {
      return user.dancer.toString() === this._id.toString();
    }
    default:
    {
      return false;
    }
  }
};

schema.post('remove', async function(doc) {
  const competencies = await Competency.find({ dancer: doc._id });
  await Promise.all(competencies.map(async competency => await competency.remove()));
});

const model = mongoose.model('Dancer', schema);
model.populatedPaths = 'competencies teams';
module.exports = model;
