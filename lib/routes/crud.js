const { Router } = require('express');
const checkAuth = require('../middleware/check-auth');

const rbac = require('../utils/rbac');

module.exports = (Model) => {
  return Router()
    .post('/', checkAuth, (req, res, next) => {
      rbac.can(req.user.role, `${Model.collection.collectionName}:create`, req)
        .then((allowed) => {
          if(allowed) {
            if((!Model.canUserCreate) || Model.canUserCreate(req.user, req.body)) {
              return Model
                .create(req.body)
                .then(entry => res.send(entry));
            }
            else {
              const err = new Error('Access to that resource not allowed');
              err.status = 403;
              return next(err);
            }
          }
          else {
            const err = new Error('Access to that resource not allowed');
            err.status = 403;
            return next(err);
          }
        });
    })
    .get('/', checkAuth, async(req, res, next) => {
      rbac.can(req.user.role, `${Model.collection.collectionName}:read`, req)
        .then(async(allowed) => {
          if(allowed) {
            if(!req.query) {
              req.query = {};
            }
            if(Model.getUserQuery) {
              Object.assign(req.query, Model.getUserQuery(req.user));
            }
            return Model
              .find(req.query)
              .populate(Model.populatedPaths)
              .then(entries => res.send(entries));
          }
          else {
            const err = new Error('Access to that resource not allowed');
            err.status = 403;
            return next(err);
          }
        });
    })
  
    .get('/:id', checkAuth, (req, res, next) => {
      rbac.can(req.user.role, `${Model.collection.collectionName}:read`, req)
        .then((allowed) => {
          if(allowed) {
            return Model
              .findById(req.params.id)
              .populate(Model.populatedPaths)
              .then(async entry => {
                if(entry && ((!entry.canUserRead) || entry.canUserRead(req.user))) {
                  return res.send(entry);
                }
                else {
                  const err = new Error('Access to that resource not allowed');
                  err.status = 403;
                  return next(err);                      
                }
              });
          }
          else {
            const err = new Error('Access to that resource not allowed');
            err.status = 403;
            return next(err);
          }
        });
    })

    .patch('/:id', checkAuth, (req, res, next) => {
      rbac.can(req.user.role, `${Model.collection.collectionName}:update`, req)
        .then((allowed) => {
          if(allowed) {
            return Model.findById(req.params.id)
              .populate(Model.populatedPaths)
              .then(async entry => {
                if(entry && (!entry.canUserWrite || entry.canUserWrite(req.user))) {
                  Object.assign(entry, req.body);
                  await entry.save();
                  return res.send(entry);
                }
                else {
                  const err = new Error('Access to that resource not allowed');
                  err.status = 403;
                  return next(err);
                }
              });
          }
          else {
            const err = new Error('Access to that resource not allowed');
            err.status = 403;
            return next(err);
          }
        });
    })
  
    .delete('/:id', checkAuth, (req, res, next) => {
      rbac.can(req.user.role, `${Model.collection.collectionName}:delete`, req)
        .then((allowed) => {
          if(allowed) {
            return Model.findById(req.params.id)
              .populate(Model.populatedPaths)
              .then(async entry => {
                if(entry && (!entry.canUserWrite || entry.canUserWrite(req.user))) {
                  await entry.remove();
                  return res.send(entry);
                }
                else {
                  const err = new Error('Access to that resource not allowed');
                  err.status = 403;
                  return next(err);
                }
              });
          }
          else {
            const err = new Error('Access to that resource not allowed');
            err.status = 403;
            return next(err);
          }
        });
    });
};
