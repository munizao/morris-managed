const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  competencies: [{ type : mongoose.Schema.ObjectId, ref : 'Competency' }],
  teams: [{ type : mongoose.Schema.ObjectId, ref : 'Team' }]
});

const model = mongoose.model('Dancer', schema);
model.populatedPaths = 'competencies teams';
module.exports = model;
