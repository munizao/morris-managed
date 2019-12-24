const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  dance: { type : mongoose.Schema.ObjectId, ref : 'Dance' },
  position: Number,
  level: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Competency', schema);
