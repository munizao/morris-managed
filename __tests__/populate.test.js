require('dotenv').config();
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Dancer = require('../lib/models/Dancer');
const User = require('../lib/models/User');
const Team = require('../lib/models/Team');

describe('why does populate not work on virtual?!', () => {
  
  beforeAll(async() => {
    connect();
    await mongoose.connection.dropDatabase();    
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('populates the freaking thing', async() => {
    console.log('got here');
    let testDancer =  await Dancer.create({
      name: 'Will K'
    });
    console.log(testDancer);
    let user = await User.create({
      email: 'dancer@test.com',
      password: 'password',
      role: 'dancer',
      dancer: testDancer._id
    });
    console.log(user);
    let team = await Team.create({
      squire: user._id,
      name: 'Bridgetown Morris Men',
      dancers: [],
    });
    console.log(team);
    await user.populate('squireOf').execPopulate();
    console.log(user);
    return expect(user.toJSON()).toEqual({
      _id: expect.any(String),
      id: expect.any(mongoose.Types.ObjectId),
      email: 'dancer@test.com',
      passwordHash: expect.any(String),
      role: 'dancer',
      dancer: testDancer._id,
      squireOf: [team],
      __v: 0
    });
  });
});
