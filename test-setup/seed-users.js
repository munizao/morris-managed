const User = require('../lib/models/User');

const seedAccounts = async() => {
  // const testDancer = await Dancer.create({
  //   name: 'Will K',
  // });
  
  const adminUser = await User.create({
    email: 'admin@test.com',
    password: 'password',
    role: 'admin',
    // note: no associated dancer object
  });  
  
  const squireUser = await User.create({
    email: 'squire@test.com',
    password: 'password',
    role: 'squire',
    // dancer: testDancer._id
  });
  
  const squireUser2 = await User.create({
    email: 'squire2@test.com',
    password: 'password',
    role: 'squire',
    // dancer: testDancer._id
  });
  
  const dancerUser = await User.create({
    email: 'dancer@test.com',
    password: 'password',
    role: 'dancer',
    // dancer: testDancer._id
  });
  
  return { squireUser, squireUser2, dancerUser, adminUser };
};

module.exports = seedAccounts;
