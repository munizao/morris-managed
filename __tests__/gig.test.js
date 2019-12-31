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
  let teams;
  beforeEach(async() => {
    ({ dancers, gigs, teams } = await testSetup());
  });

  afterAll(() => {
    return mongoose.connection.close();
  });



  it('squire user creates a gig', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return agent
      .post('/api/v1/gigs')
      .send({
        name: 'Salem Worldbeat',
        date: new Date(2020, 5, 20),
        team: teams[0]._id
      })
      .then((res) => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Salem Worldbeat',
          dancers: [],
          team: teams[0]._id.toString(),
          date: new Date(2020, 5, 20).toISOString(),
          __v: 0
        });
      });
  });

  it('dancer user can\'t create a gig', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .post('/api/v1/gigs')
      .send({
        name: 'Salem Worldbeat',
        date: new Date(2020, 5, 20),
        team: teams[0]._id
      })
      .then((res) => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('gets all gigs for users teams', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .get('/api/v1/gigs')
      .then(res => {
        gigs.forEach(gig => {
          expect(res.body).toContainEqual({
            _id: gig._id.toString(),
            name: gig.name,
            date: gig.date.toISOString(),
            dancers: [],
            team: gig.team.toString(),
            __v: 0,
          });
        });
      });
  });

  it('can\'t get gigs for anonymous user', () => {
    return request(app)
      .get('/api/v1/gigs')
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('gets a gig by id for user', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return await agent
      .get(`/api/v1/gigs/${gigs[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Paganfaire 2020',
          dancers: [],
          date: new Date(2020, 2, 10).toISOString(),
          team: teams[0]._id.toString(),
          __v: 0,
        });
      });
  });


  it('can\'t get gig by id for anonymous user', () => {
    return request(app)
      .get(`/api/v1/gigs/${gigs[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });
  
  it('squire can update a gig by id', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return await agent
      .patch(`/api/v1/gigs/${gigs[0].id}`)
      .send({ name: 'Equinox Ale' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Equinox Ale',
          dancers: [],
          date: new Date(2020, 2, 10).toISOString(),
          team: teams[0]._id.toString(),
          __v: 0,
        });
      });
  });

  it('dancer can\'t update a gig by id', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return await agent
      .patch(`/api/v1/gigs/${gigs[0].id}`)
      .send({ name: 'Equinox Ale' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('squire can delete a gig by id', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return await agent
      .delete(`/api/v1/gigs/${gigs[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Paganfaire 2020',
          dancers: [],
          date: new Date(2020, 2, 10).toISOString(),
          team: teams[0]._id.toString(),
          __v: 0
        });
      });
  });

  it('dancer can\'t delete a gig by id', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return await agent
      .delete(`/api/v1/gigs/${gigs[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

});
