const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  abstractDance: { type : mongoose.Schema.ObjectId, ref : 'AbstractDance' },
  dancers: [{ type : mongoose.Schema.ObjectId, ref : 'Dancer' }],
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  }
});

module.exports = mongoose.model('AbstractDance', schema);
