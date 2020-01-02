//from lab 14

const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tradition: String,
  props: {
    type: String,
    enum: ['sticks', 'hankies']
  },
  figures: [String],
  dancerQuantity: Number
});

schema.methods.canUserWrite = schema.methods.canUserRead = function() {
  return true;
};

schema.statics.getUserQuery = async function() {
  return {};
};

module.exports = mongoose.model('Dance', schema);
