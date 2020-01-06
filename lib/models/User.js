const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['dancer', 'squire', 'admin'],
    default: 'dancer'
  },
  dancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dancer',
    required: function() {
      return this.role === 'dancer' || this.role === 'squire';
    }
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.passwordHash;
    }
  }
});

schema.virtual('squireOf', {
  ref: 'Team',
  localField: '_id',
  foreignField: 'squire'
});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, 14);
});

schema.statics.authenticate = async function({ email, password }) {
  const user = await this.findOne({ email });
  if(!user) {
    const err = new Error('Invalid Email/Password');
    err.status = 401;
    throw err;
  }

  const validPassword = bcrypt.compareSync(password, user.passwordHash);
  if(!validPassword) {
    const err = new Error('Invalid Email/Password');
    err.status = 401;
    throw err;
  }

  return user;
};

schema.methods.authToken = function() {
  return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
    expiresIn: '24h'
  });
};

schema.statics.findByToken = function(token) {
  try {
    const tokenPayload = jwt.verify(token, process.env.APP_SECRET);
    return Promise.resolve(this.hydrate({
      _id: tokenPayload._id,
      email: tokenPayload.email,
      role: tokenPayload.role,
      dancer: tokenPayload.dancer,
      __v : tokenPayload.__v
    }));
  } catch(err) {
    return Promise.reject(err);
  }
};

module.exports = mongoose.model('User', schema);
