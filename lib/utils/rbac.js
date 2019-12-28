const Team = require('../models/Team');

const RBAC = require('easy-rbac');
module.exports = new RBAC({
  dancer: {
    can: [
      'competencies:*',
      'dances:get'
    ]
  },

  squire: {
    can: [
      'dances:create',
      {
        name: 'gigs:create',
        when: async(req) => { 
          const team = await Team.findById(req.body.team);
          return team.squire.toString() === req.user._id.toString();
        }
      }
    ],
    inherits: ['dancer']
  },

  admin: { can: ['*'] }
});
