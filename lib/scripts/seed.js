require('dotenv').config();
const User = require('../models/User');
const Dancer = require('../models/Dancer');
const Dance = require('../models/Dance');
const connect = require('../utils/connect');
const mongoose = require('mongoose');

const seed = async() => {
  await connect();
  await mongoose.connection.dropDatabase();
  await User.create({
    email: 'admin@test.com',
    password: 'password',
    role: 'admin',
    // note: no associated dancer object
  });  
  
  const squireUser = await User.create({
    email: 'squire@test.com',
    password: 'password',
    role: 'squire',
  });

  const dancerUser = await User.create({
    email: 'dancer@test.com',
    password: 'password',
    role: 'dancer',
  });

  const squireDancer = await Dancer.create({
    name: 'Will K',
  });

  const dancerDancer = await Dancer.create({
    name: 'Ali M',
  });

  squireUser.dancer = squireDancer._id;
  await squireUser.save();

  dancerUser.dancer = dancerDancer._id;
  await dancerUser.save();

  await Dance.create([
    {
      name: 'Oak and Ash and Thorn',
      tradition: 'Moulton',
      dancerQuantity: 6
    },
    {
      name: 'South Australia',
      tradition: 'Adderbury',
      dancerQuantity: 8
    },
    {
      name: 'Simon\'s Fancy',
      tradition: 'Bampton',
      dancerQuantity: 4
    },
  ]);

};

seed()
  .then(() => console.log('done seeding'));
