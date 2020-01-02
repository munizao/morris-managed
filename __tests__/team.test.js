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
    ({ teams } = await testSetup());
  });

  afterAll(() => {
    return mongoose.connection.close();
  });



  it('dancer can create a team', async() => {
    const agent = request.agent(app);
    let user;
    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      })
      .then((res) => user = res.body);

    return agent
      .post('/api/v1/teams')
      .send({
        name: 'Sound and Fury',
      })
      .then((res) => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Sound and Fury',
          dances: [],
          dancers: [],
          squire: user._id,
          __v: 0
        });
      });
  });

  it('anonymous user can\'t create a team', () => {
    return request(app)
      .post('/api/v1/teams')
      .send({
        name: 'Sound and Fury',
      })
      .then((res) => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('anonymous user can get all teams', () => {
    return request(app)
      .get('/api/v1/teams')
      .then(res => {
        teams.forEach(team => {
          expect(res.body).toContainEqual({
            _id: team._id.toString(),
            name: team.name,
            dances: [],
            squire: team.squire._id.toString(),
            dancers: team.dancers.map(dancer => dancer.toString()),
            __v: 0,
          });
        });
      });
  });

  it('anonymous user can get a team by id', () => {
    return request(app)
      .get(`/api/v1/teams/${teams[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Bridgetown Morris Men',
          dances: [],
          squire: teams[0].squire._id.toString(),
          dancers: teams[0].dancers.map(dancer => dancer.toString()),
          __v: 0,
        });
      });
  });
  
  it('squire can update a team by id', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return agent
      .patch(`/api/v1/teams/${teams[0]._id}`)
      .send({ name: 'Portland Morris' })
      .then(res => {
        expect(res.body).toEqual({
          _id: teams[0]._id.toString(),
          name: 'Portland Morris',
          dances: [],
          dancers: teams[0].dancers.map(dancer => dancer.toString()),
          squire: teams[0].squire._id.toString(),
          __v: 0,
        });
      });
  });

  it('dancer can\'t update a team by id', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .patch(`/api/v1/teams/${teams[0].id}`)
      .send({ name: 'Portland Morris' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('squire can delete a team by id', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return agent
      .delete(`/api/v1/teams/${teams[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: teams[0].id.toString(),
          name: 'Bridgetown Morris Men',
          dancers: teams[0].dancers.map(dancer => dancer.toString()),
          dances: [],
          squire: teams[0].squire._id.toString(),
          __v: 0
        });
      });
  });

  it('dancer can\'t delete a team by id', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .delete(`/api/v1/teams/${teams[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });
});
