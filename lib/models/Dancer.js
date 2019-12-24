const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  competencies: [{ type : mongoose.Schema.ObjectId, ref : 'Competency' }]
});

module.exports = mongoose.model('Dancer', schema);
