const Team = require('../models/Team');

const RBAC = require('easy-rbac');
module.exports = new RBAC({
  anonymous: {
    can: [
      'dances:get',
      'teams:get'
    ],
  },

  dancer: {
    can: [
      'competencies:*',
      'gigs:get',
      'teams:create',
      'danceperformances:get'
    ],
    inherits: ['anonymous']
  },

  squire: {
    can: [
      'dances:create',
      'gigs:update',
      'gigs:delete',
      {
        name: 'gigs:create',
        when: async(req) => { 
          const team = await Team.findById(req.body.team);
          return team.squire.toString() === req.user._id.toString();
        }
      },
      'danceperformances:*',
      'dancers:*',
      'teams:*'
    ],
    inherits: ['dancer']
  },

  admin: { can: ['*'] }
});
