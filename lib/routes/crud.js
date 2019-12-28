const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const rbac = require('../utils/rbac');

module.exports = (Model) => {
  return Router()
    .post('/', ensureAuth, (req, res) => {
      rbac.can(req.user.role, `${Model.collection.collectionName}:create`, req)
        .then((allowed) => {
          if(allowed) {
            Model
              .create(req.body)
              .then(entry => res.send(entry));
          }
          else {
            const err = new Error('Access to that resource not allowed');
            err.status = 403;
            throw err;
          }
        });
    })
    .get('/', (req, res) => {

      Model
        .find(req.query)
        .then(entries => res.send(entries));
    })
  
    .get('/:id', (req, res) => {
      Model
        .findById(req.params.id)
        .populate(Model.populatedPaths)
        .then(entry => res.send(entry));
    })
  
    .patch('/:id', (req, res) => {
      Model
        .findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate(Model.populatedPaths)
        .then(entry => res.send(entry));
    })
  
    .delete('/:id', (req, res) => {
      Model
        .findByIdAndDelete(req.params.id)
        .populate(Model.populatedPaths)
        .then(entry => res.send(entry));
    });
};
