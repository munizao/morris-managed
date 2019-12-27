require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Dancer = require('../lib/models/Dancer');

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
      .send({ email: 'test@test.com', password: 'password', name: 'Ali M' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'test@test.com',
          dancer: expect.any(String),
          role: 'dancer',
          __v: 0
        });
      });
  });

  it('signup route signs up a user with a new team', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', password: 'password', name: 'Ali M', newTeamName: 'Sound and Fury' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'test@test.com',
          dancer: expect.any(String),
          role: 'dancer',
          __v: 0
        });
      });
  });

  it('login route logs in a user', async() => {
    const dancer = await Dancer.create({ name: 'Ali M' });
    const user = await User.create({ email: 'test@test.com', password: 'password', dancer: dancer._id });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: 'test@test.com',
          role: 'dancer',
          dancer: dancer.id,
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
    const dancer = await Dancer.create({ name: 'Ali M' });
    await User.create({ email: 'test@test.com', password: 'password', dancer: dancer._id });
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
    const dancer = await Dancer.create({ name: 'Ali M' });

    const user = await User.create({
      email: 'test@test.com',
      password: 'password',
      dancer: dancer.id
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
