const { Router } = require('express');
const Recipe = require('../models/Recipe');

module.exports = Router()
  .post('/', (req, res) => {
    Recipe
      .create(req.body)
      .then(recipe => res.send(recipe));
  })

  .get('/', (req, res) => {
    Recipe
      .find()
      .select({ name: true })
      .then(recipes => res.send(recipes));
  })

  .get('/:id', (req, res) => {
    Recipe
      .findById(req.params.id)
      .then(recipe => res.send(recipe));
  })

  .patch('/:id', (req, res) => {
    Recipe
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(recipe => res.send(recipe));
  })

  .delete('/:id', (req, res) => {
    Recipe
      .findByIdAndDelete(req.params.id)
      .then(recipe => res.send(recipe));
  });
