require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const { testSetup } = require('../test-setup/setup');
const User = require('../lib/models/User');
const Team = require('../lib/models/Team');
const Competency = require('../lib/models/Competency');


describe('competency routes', () => {
  beforeAll(() => {
    connect();
  });
  let dances;
  let dancers;
  let dancerUser;
  let competencies;
  let teams;
  let squireUser;
  beforeEach(async() => {
    ({ dances, dancers, dancerUser, competencies, teams, squireUser } = await testSetup());
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('dancer can create a competency for self', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .post('/api/v1/competencies')
      .send({
        dance: dances[0]._id,
        dancer: dancerUser.dancer._id,
        levels: ['novice', 'intermediate', 
          'proficient', 'proficient', 
          'intermediate', 'intermediate']
      })
      .then((res) => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          dance: dances[0]._id.toString(),
          dancer: dancerUser.dancer._id.toString(),
          levels: ['novice', 'intermediate', 
            'proficient', 'proficient', 
            'intermediate', 'intermediate'],
          __v: 0
        });
      });
  });

  it('dancer can\'t create a competency for another dancer', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .post('/api/v1/competencies')
      .send({
        dance: dances[0]._id,
        dancer: dancers[4]._id,
        levels: ['novice', 'intermediate', 
          'proficient', 'proficient', 
          'intermediate', 'intermediate']
      })
      .then((res) => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('anonymous user can\'t create a competency', async() => {
    return request(app)
      .post('/api/v1/competencies')
      .send({
        dance: dances[0]._id,
        dancer: dancers[0]._id,
        levels: ['novice', 'intermediate', 
          'proficient', 'proficient', 
          'intermediate', 'intermediate']
      })
      .then((res) => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('squire can get a competency by id for dancers on squired teams', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return agent
      .get(`/api/v1/competencies/${competencies[1]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: competencies[1]._id.toString(),
          dance: {
            _id: dances[1]._id.toString(),
            dancerQuantity: 8,
            figures: [],
            name: 'South Australia',
            tradition: 'Adderbury',
            __v: 0,
          },
          dancer: dancers[0]._id.toString(),
          levels: [
            'proficient',
            'proficient',
            'proficient',
            'proficient',
            'proficient',
            'proficient',
            'proficient',
            'proficient'
          ],
          __v: 0
        });
      });
  });

  it('squire can\'t get a competency by id for a dancer not on squired teams', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return agent
      .get(`/api/v1/competencies/${competencies[2]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('dancer can get a competency by id for own competency', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .get(`/api/v1/competencies/${competencies[0]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: competencies[0]._id.toString(),
          dance: {
            __v: 0,
            _id: dances[0]._id.toString(),
            dancerQuantity: 6,
            figures: [],
            name: 'Oak and Ash and Thorn',
            tradition: 'Moulton',
          },
          dancer: dancerUser.dancer.toString(),
          levels: ['novice', 'novice',
            'intermediate', 'intermediate',
            'novice', 'novice'],
          __v: 0
        });
      });
  });

  it('dancer can\'t get a competency by id for another dancer\'s competency', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .get(`/api/v1/competencies/${competencies[2]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('anonymous user can\'t get a competency by id', async() => {
    return request(app)
      .get(`/api/v1/competencies/${competencies[0]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });
});
