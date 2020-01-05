const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  dancer: { type: mongoose.Schema.Types.ObjectId, ref: 'Dancer' },
  dance: { type: mongoose.Schema.Types.ObjectId, ref: 'Dance' },
  levels: [{
    type: String,
    enum: ['novice', 'intermediate', 'proficient'],
    default: 'novice'
  }]
});

schema.statics.canUserCreate = function(user, competencyObj) {
  return user.dancer.toString() === competencyObj.dancer.toString();
};

schema.methods.canUserRead = async function(user) {
  switch(user.role) {
    case 'admin': {
      return true;
    }
    case 'squire': {
      await user.populate('squireOf').execPopulate();
      const userObj = user.toObject({ virtuals: true });
      const dancers = userObj.squireOf.map(team => team.dancers).flat().map(dancer => dancer.toString());
      return dancers.includes(this.dancer.toString());
    }    
    case 'dancer': {
      return user.dancer.toString() === this.dancer.toString();
    }
    default: {
      return false;
    }
  }
};

schema.methods.canUserWrite = function(user) {
  switch(user.role) {
    case 'admin': {
      return true;
    }
    case 'squire':  
    case 'dancer': {
      return user.dancer.toString() === this.dancer.toString();
    }
    default: {
      return false;
    }
  }
};

const model = mongoose.model('Competency', schema);
model.populatedPaths = 'dance';
module.exports = model;
