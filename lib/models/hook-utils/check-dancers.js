module.exports = async(doc, key, next) => {
  const Dance = require('../Dance');
  const dance = await Dance.findById(doc.dance);
  if(dance.dancerQuantity === doc[key].length) {
    next();
  } else {
    doc.invalidate(key, `Number of ${key} must match dance.`, doc[key]);
  }
};
