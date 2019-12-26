const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  dance: { type : mongoose.Schema.ObjectId, ref : 'Dance' },
  position: Number,
  level: {
    type: Number,
    default: 0
  }
});

const model = mongoose.model('Competency', schema);
model.populatedPaths = 'dance';
module.exports = model;