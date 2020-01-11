require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const testObj = require('../test-setup/setup');

describe('dance routes', () => {
  it('squire can create a dance', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return agent
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

  it('dancer can\'t create a dance', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'dancer@test.com', 
        password: 'password'
      });

    return agent
      .post('/api/v1/dances')
      .send({
        name: 'Vandals of Hammerwich',
        tradition: 'Litchfield',
        dancerQuantity: 8
      })
      .then((res) => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('anyone can get all dances', async() => {
    const { testData } = testObj;
    const { dances } = testData;

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

  it('anyone can get all dances matching query', () => {
    const { testData } = testObj;
    const { dances } = testData;
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

  it('anyone can get a dance by id', () => {
    const { testData } = testObj;
    const { dances } = testData;
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

  it('admin can update a dance by id', async() => {
    const { testData } = testObj;
    const { dances } = testData;

    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@test.com', 
        password: 'password'
      });

    return agent
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

  it('squire can\'t update a dance by id', async() => {
    const { testData } = testObj;
    const { dances } = testData;
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return agent
      .patch(`/api/v1/dances/${dances[0].id}`)
      .send({ name: 'Mrs. Casey\'s' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });

  it('admin can delete a dance by id', async() => {
    const { testData } = testObj;
    const { dances } = testData;
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@test.com', 
        password: 'password'
      });

    return agent
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

  it('squire can\'t delete a dance by id', async() => {
    const { testData } = testObj;
    const { dances } = testData;
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'squire@test.com', 
        password: 'password'
      });

    return agent
      .delete(`/api/v1/dances/${dances[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Access to that resource not allowed',
          status: 403,
        });
      });
  });
});
