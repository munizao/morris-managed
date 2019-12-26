require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const { testSetup } = require('../test-setup/setup');


describe('gig routes', () => {
  beforeAll(() => {
    connect();
  });
  let dancers;
  let gigs;
  beforeEach(async() => {
    [, dancers, , gigs] = await testSetup();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });



  it('creates a gig', () => {
    return request(app)
      .post('/api/v1/gigs')
      .send({
        name: 'Salem Worldbeat',
        date: new Date(2020, 5, 20)
      })
      .then((res) => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Salem Worldbeat',
          dancers: [],
          date: new Date(2020, 5, 20).toISOString(),
          __v: 0
        });
      });
  });

  it('gets all gigs', () => {
    return request(app)
      .get('/api/v1/gigs')
      .then(res => {
        gigs.forEach(gig => {
          expect(res.body).toContainEqual({
            _id: gig._id.toString(),
            name: gig.name,
            date: gig.date.toISOString(),
            dancers: [],
            __v: 0,
          });
        });
      });
  });

  it('gets a gig by id', () => {
    return request(app)
      .get(`/api/v1/gigs/${gigs[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Paganfaire 2020',
          dancers: [],
          date: new Date(2020, 2, 10).toISOString(),
          __v: 0,
        });
      });
  });
  
  it('updates a gig by id', () => {
    return request(app)
      .patch(`/api/v1/gigs/${gigs[0].id}`)
      .send({ name: 'Equinox Ale' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Equinox Ale',
          dancers: [],
          date: new Date(2020, 2, 10).toISOString(),
          __v: 0,
        });
      });
  });

  it('deletes a gig by id', () => {
    return request(app)
      .delete(`/api/v1/gigs/${gigs[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Paganfaire 2020',
          dancers: [],
          date: new Date(2020, 2, 10).toISOString(),
          __v: 0
        });
      });
  });
});
