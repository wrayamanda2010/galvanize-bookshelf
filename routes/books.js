 'use strict';
const express = require('express')
// eslint-disable-next-line new-cap
const router = express.Router()
const knex = require('../knex')
const humps = require('humps')
// YOUR CODE HERE

router.get('/', (req, res, next) => {
  knex('books')
    .select('*')
    .then((rows) => {
      const sorted = rows.sort((a, b) => a.title.toUpperCase() > b.title.toUpperCase())
      res.json(sorted.map((row) => humps.camelizeKeys(row)))

    })
    .catch((err) => {
      console.log(err)
  })
})

router.get('/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .then((rows) => {
      res.json(humps.camelizeKeys(rows[0]))
    })
    .catch((err) => {
      next(err)
    })
})

router.post('/', (req, res, next) => {
  const bookFields = {
    'title': req.body.title,
    'author': req.body.author,
    'genre': req.body.genre,
    'description': req.body.description,
    'coverUrl': req.body.coverUrl,
  }
  knex('books')
    .insert(humps.decamelizeKeys(bookFields))
    .returning('*')
    .then((data) => {
      res.json(humps.camelizeKeys(data[0]))
    })
    .catch((err) => {
      next(err)
    })
})

router.patch('/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .limit(1)
    .update(humps.decamelizeKeys({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      coverUrl: req.body.coverUrl
    }))
    .returning('*')
    .then((data) => {
      res.json(humps.camelizeKeys(data[0]))
    })
    .catch((err) => {
      next(err)
    })
})

module.exports = router;
