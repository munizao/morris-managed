const mongoose = require('mongoose');
const User = require('./User');
// const Team = require('./Team');


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
    case 'squire': {
      return true;
    }
    case 'dancer': {
      const dancersByTeams = this.teams.map(team => team.dancers);
      console.log(dancersByTeams, user.dancer._id);
      console.log(dancersByTeams.flat().includes(user.dancer._id));
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
      return user.dancer === this._id;
    }
    default:
    {
      return false;
    }
  }
};

const model = mongoose.model('Dancer', schema);
model.populatedPaths = 'competencies teams';
module.exports = model;
