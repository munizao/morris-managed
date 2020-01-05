require('dotenv').config();
// const request = require('supertest');
// const app = require('../lib/app');

const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Dancer = require('../lib/models/Team');
const User = require('../lib/models/User');
const Team = require('../lib/models/Team');

describe('why does populate not work on virtual?!', () => {
  
  beforeAll(async() => {
    await connect();
    await mongoose.connection.dropDatabase();

    
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('populates the freaking thing', async() => {
    console.log('got here');
    let testDancer =  await Dancer.create({
      name: 'Will K',
    });
    console.log(testDancer);
    let user = await User.create({
      email: 'dancer@test.com',
      password: 'password',
      role: 'dancer',
      dancer: testDancer._id
    });
    console.log(user);
    let team = await Team.create([{
      squire: user._id,
      name: 'Bridgetown Morris Men',
      dancers: [],
    }]);

    console.log(team);
    console.log(user.populated('squireOf'));
    console.log(await user.populate('squireOf').execPopulate());
    console.log(user.populated('squireOf'));
    console.log(user);
    return expect(user).toEqual({
      email: 'dancer@test.com',
      passwordHash: expect.any(String),
      role: 'dancer',
      dancer: testDancer._id
    });
  });
});
