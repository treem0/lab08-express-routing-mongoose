require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');
const Event = require('../lib/models/Event');

describe('recipe routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let cookie;
  let cookiesEvent;
  beforeEach(async() => {
    cookie = await Recipe
      .create({
        name: 'Cookies',
        ingredients: [
          { name: 'flour', amount: 1, measurement: 'cup' }
        ],
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      });

    cookiesEvent = await Event.create([
      { recipeId: cookie._id, dateOfEvent: Date.now(), rating: 3 },
      { recipeId: cookie._id, dateOfEvent: Date.now(), rating: 4 },
      { recipeId: cookie._id, dateOfEvent: Date.now(), rating: 1 }
    ]);
  });
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        ingredients: [
          { name: 'flour', amount: 1, measurement: 'cup' }
        ],
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          ingredients: [
            { _id: expect.any(String), name: 'flour', amount: 1, measurement: 'cup' }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          __v: 0
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Recipe.create([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ]);

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            name: recipe.name
          });
        });
      });
  });
  it('gets all recipes with a specific ingredient using query string', async() => {
    return request(app)
      .get('/api/v1/recipes?ingredient=flour')
      .then(res => {
        expect(res.body).toEqual([{
          _id: cookie._id.toString(),
          name: 'Cookies',
          ingredients: [
            { _id: expect.any(String), name: 'flour', amount: 1, measurement: 'cup' }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          __v: 0
        }]
        );
      });
  });

  it('gets a recipe by id', async() => {
    return request(app)
      .get(`/api/v1/recipes/${cookie._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Cookies',
          ingredients: [
            { name: 'flour', amount: 1, measurement: 'cup', _id: expect.any(String) }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          events: JSON.parse(JSON.stringify(cookiesEvent)),
          __v: 0
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [
        { name: 'flour', amount: 1, measurement: 'cup' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .patch(`/api/v1/recipes/${recipe._id}`)
      .send({ name: 'good cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'good cookies',
          ingredients: [
            { _id: expect.any(String), name: 'flour', amount: 1, measurement: 'cup' }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          __v: 0
        });
      });
  });

  it('deletes a recipe by id', async() => {

    return request(app)
      .delete(`/api/v1/recipes/${cookie._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Cookies',
          ingredients: [
            { name: 'flour', amount: 1, measurement: 'cup', _id: expect.any(String) }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          events: JSON.parse(JSON.stringify(cookiesEvent)),
          __v: 0
        });
      });
  });
});
