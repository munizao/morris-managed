require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const { testSetup } = require('../test-setup/setup');


describe('team routes', () => {
  beforeAll(() => {
    connect();
  });
  let teams;
  beforeEach(async() => {
    [, , , , teams] = await testSetup();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });



  it('creates a team', () => {
    return request(app)
      .post('/api/v1/teams')
      .send({
        name: 'Sound and Fury',
      })
      .then((res) => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Sound and Fury',
          dances: [],
          __v: 0
        });
      });
  });

  it('gets all teams', () => {
    return request(app)
      .get('/api/v1/teams')
      .then(res => {
        teams.forEach(team => {
          expect(res.body).toContainEqual({
            _id: team._id.toString(),
            name: team.name,
            dances: [],
            __v: 0,
          });
        });
      });
  });

  it('gets a team by id', () => {
    return request(app)
      .get(`/api/v1/teams/${teams[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Bridgetown Morris Men',
          dances: [],
          __v: 0,
        });
      });
  });
  
  it('updates a team by id', () => {
    return request(app)
      .patch(`/api/v1/teams/${teams[0].id}`)
      .send({ name: 'Portland Morris' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Portland Morris',
          dances: [],
          __v: 0,
        });
      });
  });

  it('deletes a team by id', () => {
    return request(app)
      .delete(`/api/v1/teams/${teams[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Bridgetown Morris Men',
          dances: [],
          __v: 0
        });
      });
  });
});
