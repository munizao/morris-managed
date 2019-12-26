require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('auth routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('signup route signs up a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'test@test.com',
          role: 'dancer',
          __v: 0
        });
      });
  });
  it('login route logs in a user', async() => {
    const user = await User.create({ email: 'test@test.com', password: 'password' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: 'test@test.com',
          role: 'dancer',
          __v: 0
        });
      });
  });
  it('login route fails when email is not in db', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'bademail@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid Email/Password',
          status: 401,
        });
      });
  });
  it('login route fails on wrong password', async() => {
    await User.create({ email: 'test@test.com', password: 'password' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'badpassword' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid Email/Password',
          status: 401,
        });
      });
  });
  it('verifies a user is logged in', async() => {
    const user = await User.create({
      email: 'test@test.com',
      password: 'password'
    });
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com', 
        password: 'password'
      });

    return agent
      .get('/api/v1/auth/signed-in')
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: 'test@test.com',
          role: 'dancer',
          __v: 0
        });
      });
  });
});
