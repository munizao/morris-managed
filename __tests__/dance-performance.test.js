require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const { testSetup } = require('../test-setup/setup');


describe('dance performance routes', () => {
  beforeAll(() => {
    connect();
  });
  let dances;
  let dancers;
  let dancePerformances;
  let gigs;
  beforeEach(async() => {
    [dances, dancers, dancePerformances, gigs] = await testSetup();
  });

  afterAll(() => {
    return mongoose.connection.close();
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

  it('deletes a dance performance by id', () => {
    return request(app)
      .delete(`/api/v1/dance-performances/${dancePerformances[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          dance: JSON.parse(JSON.stringify(dances[0])),
          dancers: dancers.slice(0, 6).map(dancer => JSON.parse(JSON.stringify(dancer))),
          gig: gigs[0].id,
          __v: 0,
        });
      });
  });
});
