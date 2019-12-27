const { Router } = require('express');
const User = require('../models/User');
const Dancer = require('../models/Dancer');
// var jwt = require('jsonwebtoken');
const ensureAuth = require('../middleware/ensure-auth');
const MAX_AGE_IN_MS = 24 * 60 * 60 * 1000;

const setSessionCookie = function(res, token) {
  res.cookie('session', token, {
    maxAge: MAX_AGE_IN_MS
  });  
};

module.exports = Router()
  .post('/signup', async(req, res, next) => {
    const dancer = await Dancer.create({
      name: req.body.name,
      teams: req.body.teams
    });
    req.body.dancer = dancer._id;
    await User
      .create(req.body)
      .then(user => {
        setSessionCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    User
      .authenticate(req.body)
      .then(user => {
        setSessionCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })
  .get('/signed-in', ensureAuth, (req, res) => {
    res.send(req.user);
  });
