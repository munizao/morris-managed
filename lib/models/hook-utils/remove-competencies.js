const Competency = require('../Competency');

module.exports = async(doc, key) => {
  const competencies = await Competency.find({ [key]: doc._id });
  await Promise.all(competencies.map(async competency => await competency.remove()));
};


