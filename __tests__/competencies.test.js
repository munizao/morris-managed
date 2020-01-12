require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const testObj = require('../test-setup/setup');

describe('competency routes', () => {
  it('dancer can create a competency for self', async() => {
    const { dancerUser } = testObj.testUsers;
    const { dances } = testObj.testData;

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
        dancer: dancerUser.dancer,
        levels: ['novice', 'intermediate', 
          'proficient', 'proficient', 
          'intermediate', 'intermediate']
      })
      .then((res) => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          dance: dances[0]._id.toString(),
          dancer: dancerUser.dancer.toString(),
          levels: ['novice', 'intermediate', 
            'proficient', 'proficient', 
            'intermediate', 'intermediate'],
          __v: 0
        });
      });
  });

  it('dancer can\'t create a competency for another dancer', async() => {
    const { dances, dancers } = testObj.testData;
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
    const { dances, dancers } = testObj.testData;
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
    const { dances, dancers, competencies } = testObj.testData;
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
    const { competencies } = testObj.testData;

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
    const { dancerUser } = testObj.testUsers;
    const { dances, competencies } = testObj.testData;
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
    const { competencies } = testObj.testData;
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
    const { competencies } = testObj.testData;

    return request(app)
      .get(`/api/v1/competencies/${competencies[0]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('dancer can update their own competency by id', async() => {
    const { dances, competencies } = testObj.testData;
    const { dancerUser } = testObj.testUsers;
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .patch(`/api/v1/competencies/${competencies[0].id}`)
      .send({ levels: [
        'novice', 'intermediate',
        'intermediate', 'intermediate',
        'intermediate', 'novice'
      ] })
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
          levels: ['novice', 'intermediate',
            'intermediate', 'intermediate',
            'intermediate', 'novice'],
          __v: expect.any(Number)
        });
      });
  });

  it('dancer can\'t update another dancer\'s competency by id', async() => {
    const { competencies } = testObj.testData;
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .patch(`/api/v1/competencies/${competencies[2].id}`)
      .send({ levels: ['novice', 'novice', 'novice', 'novice'] })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('anonymous user can\'t update competency by id', async() => {
    const { competencies } = testObj.testData;

    return request(app)
      .patch(`/api/v1/competencies/${competencies[2].id}`)
      .send({ levels: ['novice', 'novice', 'novice', 'novice'] })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('dancer can delete their own competency by id', async() => {
    const { competencies, dances } = testObj.testData;
    const { dancerUser } = testObj.testUsers;
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .delete(`/api/v1/competencies/${competencies[0].id}`)
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

  it('dancer can\'t delete another dancer\'s competency by id', async() => {
    const { competencies } = testObj.testData;

    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .delete(`/api/v1/competencies/${competencies[2].id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('anonymous user can\'t delete competency by id', async() => {
    const { competencies } = testObj.testData;
    return request(app)
      .delete(`/api/v1/competencies/${competencies[2].id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

});
