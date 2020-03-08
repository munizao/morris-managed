require('dotenv').config();
const testObj = require('../../test-setup/setup');
const DancePerformance = require('./DancePerformance');

describe('dancePerformance schema', () => {
  it('validation rejects when number of dancers does not match dance.', async() => {
    const { dances, dancers, gigs, teams } = testObj.testData;
    const badDancePerformance = new DancePerformance(
      {
        dance: dances[0].id,
        dancers: [
          dancers[0].id,
          dancers[1].id,
          dancers[2].id,
        ],
        gig: gigs[0].id,
        team: teams[0]._id
      });
    try {
      await badDancePerformance.validate();
    }
    catch(err) {
      expect(err.errors.dancers.message).toEqual('Number of dancers must match dance.');
    }
  });

  it('validation accepts null in dancers array.', async() => {
    const { dances, dancers, gigs, teams } = testObj.testData;
    const newDancePerformance = new DancePerformance(
      {
        dance: dances[0].id,
        dancers: [
          dancers[0].id,
          null,
          dancers[1].id,
          null,
          dancers[2].id,
          null
        ],
        gig: gigs[0].id,
        team: teams[0]._id
      });

    const res = await newDancePerformance.validate();
    expect(res).toBeUndefined();
  });

});
