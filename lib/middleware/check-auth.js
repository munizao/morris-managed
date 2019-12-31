const User = require('../models/User');

module.exports = (req, res, next) => {
  const token = req.cookies.session;
  User
    .findByToken(token, res)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(() => {
      req.user = { role: 'anonymous' };
      next();
    });
};
