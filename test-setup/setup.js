const mongoose = require('mongoose');
const Dance = require('../lib/models/Dance');
const DancePerformance = require('../lib/models/DancePerformance');
const Dancer = require('../lib/models/Dancer');
// const Competency = require('../lib/models/Competency');
const Gig = require('../lib/models/Gig');
const Team = require('../lib/models/Team');
const User = require('../lib/models/User');

const testSetup = async() => {
  let dances;
  let dancers;
  let dancePerformances;
  let gigs;
  let squireUser;
  let dancerUser;
  let adminUser;

  await mongoose.connection.dropDatabase();
  const testDancer = await Dancer.create({
    name: 'Will K',
  });

  adminUser = await User.create({
    email: 'admin@test.com',
    password: 'password',
    role: 'admin',
    // note: no associated dancer object
  });  

  squireUser = await User.create({
    email: 'squire@test.com',
    password: 'password',
    role: 'squire',
    dancer: testDancer._id
  });

  dancerUser = await User.create({
    email: 'dancer@test.com',
    password: 'password',
    role: 'dancer',
    dancer: testDancer._id
  });

  dances = await Dance.create([
    {
      name: 'Oak and Ash and Thorn',
      tradition: 'Moulton',
      dancerQuantity: 6
    },
    {
      name: 'South Australia',
      tradition: 'Adderbury',
      dancerQuantity: 8
    },
    {
      name: 'Simon\'s Fancy',
      tradition: 'Bampton',
      dancerQuantity: 4
    },
  ]);
  dancers = await Dancer.create([
    { name: 'Ali M' },
    { name: 'Linda G' },
    { name: 'David S' },
    { name: 'Wilson A' },
    { name: 'Debbi I' },
    { name: 'Azalea M' },
    { name: 'Joan Z' },
    { name: 'Scott T' }
  ]);
  const teams = await Team.create(
    [
      {
        squire: squireUser._id,
        name: 'Bridgetown Morris Men',
        dancers: [
          testDancer.id,
          dancers[0].id,
          dancers[1].id,
          dancers[2].id,
          dancers[3].id,
        ],
      },
      {
        squire: squireUser._id,
        name: 'Renegade Rose Morris',
        dancers: [
          dancers[4].id,
          dancers[5].id,
          dancers[6].id,
          dancers[7].id,
        ],
      }
    ]
  );

  gigs = await Gig.create([
    {
      name: 'Paganfaire 2020',
      date: new Date(2020, 2, 10),
      team: teams[0]._id
    },
    {
      name: 'Mayday 2020',
      date: new Date(2020, 4, 1),
      team: teams[0]._id
    },
  ]);
  dancePerformances = await DancePerformance.create([
    {
      dance: dances[0].id,
      dancers: [
        dancers[0].id,
        dancers[1].id,
        dancers[2].id,
        dancers[3].id,
        dancers[4].id,
        dancers[5].id,
      ],
      gig: gigs[0].id,
      team: teams[0]._id
    },
    {
      dance: dances[1].id,
      dancers: [
        dancers[0].id,
        dancers[1].id,
        dancers[2].id,
        dancers[3].id,
        dancers[4].id,
        dancers[5].id,
        dancers[6].id,
        dancers[7].id,
      ],
      gig: gigs[0].id,
      team: teams[0]._id
    },
    {
      dance: dances[2].id,
      dancers: [
        dancers[0].id,
        dancers[1].id,
        dancers[2].id,
        dancers[3].id,
      ],
      gig: gigs[0].id,
      team: teams[0]._id
    }
  ]);

  dancers = await Promise.all(dancers.map((dancer) => Dancer.findById(dancer._id)));

  return { dances, dancers, dancePerformances, gigs, teams, squireUser, dancerUser, adminUser };
};

module.exports = { testSetup };
