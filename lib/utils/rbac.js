const Team = require('../models/Team');

const RBAC = require('easy-rbac');
module.exports = new RBAC({
  anonymous: {
    can: [
      'dances:read',
      'teams:read'
    ],
  },

  dancer: {
    can: [
      'competencies:*',
      'gigs:read',
      'teams:create',
      'danceperformances:read',
      'dancers:read',
      'dancers:update'
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
      'teams:*',
      'dancers:create'
    ],
    inherits: ['dancer']
  },

  admin: { can: ['*'] }
});
