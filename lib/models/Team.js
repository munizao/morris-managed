const mongoose = require('mongoose');
const Dancer = require('./Dancer');

const schema = new mongoose.Schema({
  squire: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: {
    type: String,
    required: true
  },
  dances: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Dance' 
  }],
  dancers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Dancer' 
  }]
});

schema.methods.canUserWrite = function(user) {
  return this.squire.toString() === user._id.toString();
};

schema.statics.canUserCreate = function(user, teamObj) {
  teamObj.squire = user._id;
  return true;
};

//This is hacky because we're keeping two sets of refs that could get out of sync, but I'll keep it for now. 
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
