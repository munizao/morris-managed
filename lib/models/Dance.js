const removeCompetencies = require('./hook-utils/remove-competencies');
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
  await removeCompetencies(doc, 'dance');
});

module.exports = mongoose.model('Dance', schema);
