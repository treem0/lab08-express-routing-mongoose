const { Router } = require('express');
const Recipe = require('../models/Recipe');
const Event = require('../models/Event');

module.exports = Router()
  .post('/', (req, res) => {
    Recipe
      .create(req.body)
      .then(recipe => res.send(recipe));
  })

  .get('/', (req, res) => {
    if(req.query.ingredient) {
      Recipe
        .find({ 'ingredients.name': req.query.ingredient })
        // .select({ name: true, ingredient: true })
        .then(recipes => res.send(recipes));
    } else {
      Recipe
        .find()
        .select({ name: true })
        .then(recipes => res.send(recipes));
    }
  })

  .get('/:id', (req, res) => {
    Promise.all([
      Recipe
        .findById(req.params.id),
      Event.find({ recipeId: req.params.id })
    ])
      .then(([recipe, events]) => res.send({ ...recipe.toJSON(), events }));
  })

  .patch('/:id', (req, res) => {
    Recipe
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(recipe => res.send(recipe));
  })

  .delete('/:id', (req, res) => {
    Promise.all([
      Recipe
        .findByIdAndDelete(req.params.id),
      Event.find({ recipeId: req.params.id })
    ])
      .then(([recipe, events]) => res.send({ ...recipe.toJSON(), events }));
  });
