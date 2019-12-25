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

// function compareId(a, b) {
//   if(a._id < b._id) return 1;
//   if(a._id > b._id) return -1;
//   return 0;
// }

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });
  let dances;
  let dancePerformances;
  let dancers;
  let competencies;
  let gigs;
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
    gigs = await Gig.create([
      {
        name: 'Paganfaire 2020',
        date: Date(2020, 3, 10)
      },
      {
        name: 'Mayday 2020',
        date: Date(2020, 5, 1)
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
      .send({ name: 'Mrs. Casey\'s' })
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

  it('creates a dancer', () => {
    return request(app)
      .post('/api/v1/dancers')
      .send({
        name: 'Dawn C',
      })
      .then((res) => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Dawn C',
          competencies: [],
          __v: 0
        });
      });
  });

  it('gets all dancers', () => {
    return request(app)
      .get('/api/v1/dancers')
      .then(res => {
        dancers.forEach(dancer => {
          expect(res.body).toContainEqual({
            _id: dancer._id.toString(),
            name: dancer.name,
            competencies: [],
            __v: 0,
          });
        });
      });
  });

  it('gets a dancer by id', () => {
    return request(app)
      .get(`/api/v1/dancers/${dancers[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Ali M',
          competencies: expect.any(Array),
          __v: 0,
        });
      });
  });
  
  it('updates a dancer by id', () => {
    return request(app)
      .patch(`/api/v1/dancers/${dancers[0].id}`)
      .send({ name: 'Dawn C' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Dawn C',
          competencies: expect.any(Array),
          __v: 0,
        });
      });
  });

  it('deletes a dancer by id', () => {
    return request(app)
      .delete(`/api/v1/dancers/${dancers[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Ali M',
          competencies: expect.any(Array),
          __v: 0
        });
      });
  });

  it('creates a dance performance', () => {
    return request(app)
      .post('/api/v1/dance-performances')
      .send({
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
      })
      .then((res) => {
        expect(res.body).toEqual({
          _id: expect.any(String),
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
          __v: 0
        });
      });
  });

  it('gets all dance performances', () => {
    return request(app)
      .get('/api/v1/dance-performances')
      .then(res => {
        dancePerformances.forEach(dancePerformance => {
          expect(res.body).toContainEqual({
            _id: dancePerformance._id.toString(),
            dance: dancePerformance.dance.toString(),
            dancers: dancePerformance.dancers.map(dancer => dancer.toString()),
            gig: dancePerformance.gig.toString(),
            __v: 0,
          });
        });
      });
  });

  it('gets a dance performance by id', () => {
    return request(app)
      .get(`/api/v1/dance-performances/${dancePerformances[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: dancePerformances[0]._id.toString(),
          dance: JSON.parse(JSON.stringify(dances[0])),
          dancers: dancers.slice(0, 6).map(dancer => JSON.parse(JSON.stringify(dancer))),
          gig: gigs[0].id,
          __v: 0,
        });
      });
  });
  
  it('updates a dance performance by id', () => {
    return request(app)
      .patch(`/api/v1/dance-performances/${dancePerformances[0].id}`)
      .send({ gig: gigs[1]._id })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          dance: JSON.parse(JSON.stringify(dances[0])),
          dancers: dancers.slice(0, 6).map(dancer => JSON.parse(JSON.stringify(dancer))),
          gig: gigs[1].id,
          __v: 0,
        });
      });
  });

  it('delete a dance performance by id', () => {
    return request(app)
      .delete(`/api/v1/dance-performances/${dancePerformances[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          dance: JSON.parse(JSON.stringify(dances[0])),
          dancers: dancers.slice(0, 6).map(dancer => JSON.parse(JSON.stringify(dancer))),
          gig: gigs[1].id,
          __v: 0,
        });
      });
  });
});
