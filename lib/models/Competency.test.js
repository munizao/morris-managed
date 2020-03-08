require('dotenv').config();
const testObj = require('../../test-setup/setup');
const Competency = require('./Competency');

describe('Competency schema', () => {
  it('validation rejects when number of levels does not match dance.', async() => {
    const { dances } = testObj.testData;
    const badCompetency = new Competency(
      {
        dance: dances[0].id,
        levels: [0, 0, 1, 1]
      });
    try {
      await badCompetency.validate();
    }
    catch(err) {
      expect(err.errors.levels.message).toEqual('Number of levels must match dance.');
    }
  });
});
