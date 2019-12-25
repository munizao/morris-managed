const { Router } = require('express');

module.exports = (Collection, populatedPaths) => {
  return Router()
    .post('/', (req, res) => {
      Collection
        .create(req.body)
        .then(entry => res.send(entry));
    })
    .get('/', (req, res) => {
      Collection
        .find(req.query)
        .then(entries => res.send(entries));
    })
  
    .get('/:id', (req, res) => {
      Collection
        .findById(req.params.id)
        .populate(populatedPaths)
        .then(entry => res.send(entry));
    })
  
    .patch('/:id', (req, res) => {
      Collection
        .findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(entry => res.send(entry));
    })
  
    .delete('/:id', (req, res) => {
      Collection
        .findByIdAndDelete(req.params.id)
        .then(entry => res.send(entry));
    });
};