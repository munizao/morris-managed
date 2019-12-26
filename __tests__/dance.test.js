require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const { testSetup } = require('../test-setup/setup');


describe('dance routes', () => {
  beforeAll(() => {
    connect();
  });
  let dances;
  beforeEach(async() => {
    [dances, , , ] = await testSetup();
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
});
