const Dance = require('../lib/models/Dance');
const DancePerformance = require('../lib/models/DancePerformance');
const Dancer = require('../lib/models/Dancer');
const Gig = require('../lib/models/Gig');
const Team = require('../lib/models/Team');
const Competency = require('../lib/models/Competency');

const seedData = async(testUsers) => {
  let squireUser;
  let squireUser2;
  let dancerUser;

  ({ squireUser, squireUser2, dancerUser } = await testUsers);

  const testDancer = await Dancer.create({
    name: 'Will K',
  });
  squireUser.dancer = testDancer._id;
  await squireUser.save();
  squireUser2.dancer = testDancer._id;
  await squireUser2.save();
  dancerUser.dancer = testDancer._id;
  await dancerUser.save();


  const dances = await Dance.create([
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
  let dancers = await Dancer.create([
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
          dancerUser.dancer._id,
          dancers[0]._id,
          dancers[1]._id,
          dancers[2]._id,
          dancers[3]._id,
        ],
      },
      {
        squire: squireUser2._id,
        name: 'Renegade Rose Morris',
        dancers: [
          dancers[4]._id,
          dancers[5]._id,
          dancers[6]._id,
          dancers[7]._id,
        ],
      }
    ]
  );
  // we need this currently because creating teams re-saves the dancers.
  dancers = await Promise.all(dancers.map(dancer => Dancer.findById(dancer._id)));
  const gigs = await Gig.create([
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
  const dancePerformances = await DancePerformance.create([
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

  const competencies = await Competency.create(
    [
      {
        dance: dances[0]._id,
        dancer: dancerUser.dancer,
        levels: [0, 0,
          1, 1,
          0, 0]
      },
      {
        dance: dances[1]._id,
        dancer: dancers[0]._id,
        levels: [2, 2,
          2, 2,
          2, 2,
          2, 2]
      },
      {
        dance: dances[2]._id,
        dancer: dancers[5]._id,
        levels: [1, 2,
          2, 1]
      }
    ]
  );

  return { dances, dancers, gigs, teams, dancePerformances, competencies };
};

module.exports = seedData;
