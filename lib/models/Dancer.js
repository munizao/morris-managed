const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  competencies: [{ type : mongoose.Schema.ObjectId, ref : 'Competency' }]
});

const model = mongoose.model('Dancer', schema);
model.populatedPaths = 'competencies';
module.exports = model;
