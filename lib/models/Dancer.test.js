require('dotenv').config();

const Competency = require('./Competency');
const testObj = require('../../test-setup/setup');

describe('dancer schema', () => {
  it('deleting a dance deletes related competencies', async() => {
    const { dancers } = testObj.testData;
    const preCompetencies = await Competency.find({ dancer: dancers[0]._id });
    expect(preCompetencies.length).toEqual(1);
    await dancers[0].remove();
    const postCompetencies = await Competency.find({ dancer: dancers[0]._id });
    expect(postCompetencies.length).toEqual(0);
  });

});
