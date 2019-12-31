const { Router } = require('express');
const Dancer = require('../models/Dancer');
const checkAuth = require('../middleware/check-auth');

const rbac = require('../utils/rbac');

module.exports = (Model) => {
  return Router()
    .post('/', checkAuth, (req, res, next) => {
      rbac.can(req.user.role, `${Model.collection.collectionName}:create`, req)
        .then((allowed) => {
          if(allowed) {
            return Model
              .create(req.body)
              .then(entry => res.send(entry));
          }
          else {
            const err = new Error('Access to that resource not allowed');
            err.status = 403;
            return next(err);
          }
        });
    })
    .get('/', checkAuth, async(req, res, next) => {
      rbac.can(req.user.role, `${Model.collection.collectionName}:get`, req)
        .then(async(allowed) => {
          if(allowed) {
            if(Model.accessBy) {
              if(!req.query) {
                req.query = {};
              }
              const dancer = await Dancer.findById(req.user.dancer);
              if(Model.accessBy === 'team') {
                req.query.team = dancer.teams;
              } 
            }
            return Model
              .find(req.query)
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
      rbac.can(req.user.role, `${Model.collection.collectionName}:get`, req)
        .then((allowed) => {
          if(allowed) {
            return Model
              .findById(req.params.id)
              .populate(Model.populatedPaths)
              .then(async entry => {
                if(Model.accessBy) {
                  if(Model.accessBy === 'team') {
                    const dancer = await Dancer.findById(req.user.dancer);
                    if(dancer.teams.includes(entry.team)) {
                      return res.send(entry);
                    }
                    else {
                      const err = new Error('Access to that resource not allowed');
                      err.status = 403;
                      return next(err);                      
                    }
                  }
                }
                else {
                  return res.send(entry);
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
            if(Model.accessBy) {
              return Model.findById(req.params.id)
                .populate(Model.populatedPaths)
                .then(async entry => {
                  if(entry) {
                    if(Model.accessBy === 'team') {
                      const dancer = await Dancer.findById(req.user.dancer);
                      if(dancer.teams.includes(entry.team)) {
                        Object.assign(entry, req.body);
                        await entry.save();
                        return res.send(entry);
                      }
                      else {
                        const err = new Error('Access to that resource not allowed');
                        err.status = 403;
                        return next(err);
                      }
                    }
                    else {
                      console.log('we should not get here yet');
                      return next();
                    }
                  }
                  else return next();
                });
            }
            else {
              return Model
                .findByIdAndUpdate(req.params.id, req.body, { new: true })
                .populate(Model.populatedPaths)
                .then(entry => res.send(entry));
            }
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
            if(Model.accessBy) {
              return Model.findById(req.params.id)
                .populate(Model.populatedPaths)
                .then(async entry => {
                  if(entry) {
                    if(Model.accessBy === 'team') {
                      const dancer = await Dancer.findById(req.user.dancer);
                      if(dancer.teams.includes(entry.team)) {
                        await entry.remove();
                        return res.send(entry);
                      }
                      else {
                        const err = new Error('Access to that resource not allowed');
                        err.status = 403;
                        return next(err);
                      }
                    }
                    else {
                      console.log('we should not get here yet');
                      return next();
                    }
                  }
                  else return next();
                });
                
            }
            else {
              return Model
                .findByIdAndDelete(req.params.id, req.body, { new: true })
                .populate(Model.populatedPaths)
                .then(entry => res.send(entry));
            }
          }
          else {
            const err = new Error('Access to that resource not allowed');
            err.status = 403;
            return next(err);
          }
        });
    });
};
