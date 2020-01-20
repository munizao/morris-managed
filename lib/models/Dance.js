const Competency = require('./Competency');

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

schema.statics.getUserQuery = async function() {
  return {};
};

schema.post('remove', async function(doc) {
  const competencies = await Competency.find({ dance: doc._id });
  await Promise.all(competencies.map(async competency => await competency.remove()));
});

module.exports = mongoose.model('Dance', schema);
