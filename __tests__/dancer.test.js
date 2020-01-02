require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const { testSetup } = require('../test-setup/setup');


describe('dancer routes', () => {
  beforeAll(() => {
    connect();
  });
  let dancers;
  let teams;
  beforeEach(async() => {
    ({ dancers, teams } = await testSetup());
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('squire can create a dancer', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return agent
      .post('/api/v1/dancers')
      .send({
        name: 'Dawn C',
        teams: [teams[0]._id]
      })
      .then((res) => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Dawn C',
          competencies: [],
          teams: [teams[0]._id.toString()],
          __v: 0
        });
      });
  });

  it('dancer can\'t create a dancer', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .post('/api/v1/dancers')
      .send({
        name: 'Dawn C',
        teams: [teams[0]._id]
      })
      .then((res) => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('admin can get all dancers', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@test.com', 
        password: 'password'
      });

    return agent
      .get('/api/v1/dancers')
      .then(res => {
        dancers.forEach(dancer => {
          expect(res.body).toContainEqual({
            _id: dancer._id.toString(),
            name: dancer.name,
            competencies: [],
            teams: dancer.teams.map(team => team.toString()),
            __v: 1,
          });
        });
      });
  });  

  it('dancer can get all dancers on same team(s)', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .get('/api/v1/dancers')
      .then(res => {
        dancers.forEach(dancer => {
          expect(res.body).toContainEqual({
            _id: dancer._id.toString(),
            name: dancer.name,
            competencies: [],
            teams: dancer.teams.map(team => team.toString()),
            __v: 1,
          });
        });
      });
  });

  it('anonymous user can\'t get all dancers', () => {
    return request(app)
      .get('/api/v1/dancers')
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('dancer can get a dancer on same team by id', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .get(`/api/v1/dancers/${dancers[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Ali M',
          competencies: expect.any(Array),
          teams: [
            {
              _id: teams[0]._id.toString(),
              name: 'Bridgetown Morris Men',
              dances: [],
              squire: teams[0].squire._id.toString(),
              dancers: teams[0].dancers.map(dancer => dancer.toString()),
              __v: 0,
            }
          ],
          __v: 1,
        });
      });
  });

  it('anonymous user can\'t get a dancer by id', () => {
    return request(app)
      .get(`/api/v1/dancers/${dancers[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });
  
  it('squire can update a dancer on squired team by id', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return agent
      .patch(`/api/v1/dancers/${dancers[0].id}`)
      .send({ name: 'Dawn C' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Dawn C',
          competencies: [],
          teams: [
            {
              _id: teams[0]._id.toString(),
              name: 'Bridgetown Morris Men',
              dances: [],
              squire: teams[0].squire._id.toString(),
              dancers: teams[0].dancers.map(dancer => dancer.toString()),
              __v: 0,
            }
          ],
          __v: 1,
        });
      });
  });

  it('admin can delete a dancer by id', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@test.com', 
        password: 'password'
      });

    return agent
      .delete(`/api/v1/dancers/${dancers[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Ali M',
          competencies: expect.any(Array),
          teams: [
            {
              _id: teams[0]._id.toString(),
              name: 'Bridgetown Morris Men',
              dances: [],
              squire: teams[0].squire._id.toString(),
              dancers: teams[0].dancers.map(dancer => dancer.toString()),
              __v: 0,
            }
          ],
          __v: 1
        });
      });
  });

  it('squire can\'t delete a dancer by id', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return agent
      .delete(`/api/v1/dancers/${dancers[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });
});
