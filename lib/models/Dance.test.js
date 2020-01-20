require('dotenv').config();

const Competency = require('./Competency');
const testObj = require('../../test-setup/setup');

describe('dance schema', () => {
  it('deleting a dance deletes related competencies', async() => {
    const { dances } = testObj.testData;
    const preCompetencies = await Competency.find({ dance: dances[0]._id });
    expect(preCompetencies.length).toEqual(1);
    await dances[0].remove();
    const postCompetencies = await Competency.find({ dancer: dances[0]._id });
    expect(postCompetencies.length).toEqual(0);
  });

});
