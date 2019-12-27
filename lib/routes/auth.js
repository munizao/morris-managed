const { Router } = require('express');
const User = require('../models/User');
const Dancer = require('../models/Dancer');
const Team = require('../models/Team');

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
    let newTeam;
    if(req.body.newTeamName) {
      newTeam = await Team.create({
        name: req.body.newTeamName
      });
    }
    const teams = [];
    if(newTeam) {
      teams.push(newTeam);
    }
    if(req.body.teams) {
      teams.concat(req.body.teams);
    }
    const dancer = await Dancer.create({
      name: req.body.name,
      teams: teams
    });
    req.body.dancer = dancer._id;
    await User
      .create(req.body)
      .then(async user => {
        await user.populate('dancer');
        setSessionCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    User
      .authenticate(req.body)
      .then(user => {
        user.populate('dancer');
        setSessionCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })
  .get('/signed-in', ensureAuth, (req, res) => {
    res.send(req.user);
  });
