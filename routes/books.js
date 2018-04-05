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

//
// router.get('/:id', (req, res, next) => {
//   knex('books')
//     .where('id', req.params.id)
//     .then((rows) => {
//       res.json(rows)
//     })
//     .catch((err) => {
//       next(err)
//     })
// })

module.exports = router;
