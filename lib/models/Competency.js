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
      // this is where I check user.squireOf, if I can get it to populate
      return true;
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
    case 'squire': {
      return true;
    }    
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
