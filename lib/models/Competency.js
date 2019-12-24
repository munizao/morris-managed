const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  abstractDance: { type : mongoose.Schema.ObjectId, ref : 'AbstractDance' },
  position: Number,
  level: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Competency', schema);
