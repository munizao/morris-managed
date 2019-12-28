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
  beforeEach(async() => {
    ({ dancers } = await testSetup());
  });

  afterAll(() => {
    return mongoose.connection.close();
  });



  it('creates a dancer', () => {
    return request(app)
      .post('/api/v1/dancers')
      .send({
        name: 'Dawn C',
      })
      .then((res) => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Dawn C',
          competencies: [],
          teams: [],
          __v: 0
        });
      });
  });

  it('gets all dancers', () => {
    return request(app)
      .get('/api/v1/dancers')
      .then(res => {
        dancers.forEach(dancer => {
          expect(res.body).toContainEqual({
            _id: dancer._id.toString(),
            name: dancer.name,
            competencies: [],
            teams: [],
            __v: 0,
          });
        });
      });
  });

  it('gets a dancer by id', () => {
    return request(app)
      .get(`/api/v1/dancers/${dancers[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Ali M',
          competencies: expect.any(Array),
          teams: [],
          __v: 0,
        });
      });
  });
  
  it('updates a dancer by id', () => {
    return request(app)
      .patch(`/api/v1/dancers/${dancers[0].id}`)
      .send({ name: 'Dawn C' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Dawn C',
          competencies: expect.any(Array),
          teams: [],
          __v: 0,
        });
      });
  });

  it('deletes a dancer by id', () => {
    return request(app)
      .delete(`/api/v1/dancers/${dancers[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Ali M',
          competencies: expect.any(Array),
          teams: [],
          __v: 0
        });
      });
  });
});
