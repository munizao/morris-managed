require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Dance = require('../lib/models/Dance');
const DancePerformance = require('../lib/models/DancePerformance');
const Dancer = require('../lib/models/Dancer');
const Competency = require('../lib/models/Competency');
const Gig = require('../lib/models/Gig');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });
  let dances;
  let dancePerformances;
  let dancers;
  let competencies;
  let gig;
  beforeEach(async() => {
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
    gig = await Gig.create({
      name: 'Paganfaire 2020',
      date: Date(2020, 3, 10)
    });
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
        gig: gig.id
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
        gig: gig.id
      },
      {
        dance: dances[2].id,
        dancers: [
          dancers[0].id,
          dancers[1].id,
          dancers[2].id,
          dancers[3].id,
        ],
        gig: gig.id
      }
    ]);
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a dance', () => {
    return request(app)
      .post('/api/v1/dances')
      .send({
        name: 'Vandals of Hammerwich',
        tradition: 'Litchfield',
        dancerQuantity: 8
      })
      .then((res) => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Vandals of Hammerwich',
          tradition: 'Litchfield',
          figures: [],
          dancerQuantity: 8,
          __v: 0
        });
      });
  });

  it('gets all dances', () => {
    return request(app)
      .get('/api/v1/dances')
      .then(res => {
        dances.forEach(dance => {
          expect(res.body).toContainEqual({
            _id: dance._id.toString(),
            name: dance.name,
            tradition: dance.tradition,
            figures: expect.any(Array),
            dancerQuantity: dance.dancerQuantity,
            __v: 0,
          });
        });
      });
  });

  it('gets all dances matching query', () => {
    return request(app)
      .get('/api/v1/dances?tradition=Bampton')
      .then(res => {
        expect(res.body).toEqual([
          {
            _id: dances[2]._id.toString(),
            name: 'Simon\'s Fancy',
            tradition: 'Bampton',
            dancerQuantity: 4,
            figures: expect.any(Array),
            __v: 0,
          }
        ]);
      });
  });

  it('gets a dance by id', () => {
    return request(app)
      .get(`/api/v1/dances/${dances[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Oak and Ash and Thorn',
          figures: expect.any(Array),
          tradition: 'Moulton',
          dancerQuantity: 6,
          __v: 0,
        });
      });
  });

  it('updates a dance by id', () => {
    return request(app)
      .patch(`/api/v1/dances/${dances[0].id}`)
      .send({ name: 'Mrs. Casey\'s'})
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Mrs. Casey\'s',
          figures: expect.any(Array),
          tradition: 'Moulton',
          dancerQuantity: 6,
          __v: 0,
        });
      });
  });

  it('deletes a dance by id', () => {
    return request(app)
      .delete(`/api/v1/dances/${dances[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Oak and Ash and Thorn',
          figures: expect.any(Array),
          tradition: 'Moulton',
          dancerQuantity: 6,
          __v: 0
        });
      });
  });
});
