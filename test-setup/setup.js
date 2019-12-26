const mongoose = require('mongoose');
const Dance = require('../lib/models/Dance');
const DancePerformance = require('../lib/models/DancePerformance');
const Dancer = require('../lib/models/Dancer');
// const Competency = require('../lib/models/Competency');
const Gig = require('../lib/models/Gig');

const testSetup = async() => {
  let dances;
  let dancers;
  let dancePerformances;
  let gigs;
  await mongoose.connection.dropDatabase();
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
  gigs = await Gig.create([
    {
      name: 'Paganfaire 2020',
      date: new Date(2020, 2, 10)
    },
    {
      name: 'Mayday 2020',
      date: new Date(2020, 4, 1)
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
      gig: gigs[0].id
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
      gig: gigs[0].id
    },
    {
      dance: dances[2].id,
      dancers: [
        dancers[0].id,
        dancers[1].id,
        dancers[2].id,
        dancers[3].id,
      ],
      gig: gigs[0].id
    }
  ]);
  return [dances, dancers, dancePerformances, gigs];
};

module.exports = { testSetup };
