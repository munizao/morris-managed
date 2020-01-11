const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const seedData = require('./seed-data');
const seedUsers = require('./seed-users');
const models = [
  require('../lib/models/Team'),
  require('../lib/models/Gig'), 
  require('../lib/models/Competency'), 
  require('../lib/models/DancePerformance'), 
  require('../lib/models/Dancer'),
  require('../lib/models/Dance'),
];

const testObj = {};

beforeAll(async() => {
  await connect();
  await mongoose.connection.dropDatabase();
  testObj.testUsers = await seedUsers();
});

beforeEach(async() => {
  // Silently ignore the errors from dropping collections that don't exist. 
  await Promise.all(models.map(model => model.collection.drop().catch(() => true)));
  testObj.testData = await seedData(testObj.testUsers);
});

afterAll(() => {
  return mongoose.connection.close();
});

module.exports = testObj;
