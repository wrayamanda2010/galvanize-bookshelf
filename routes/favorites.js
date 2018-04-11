'use strict';

const express = require('express')
const humps = require('humps')
const knex = require('../knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.get('/', (req, res, next) => {
  if (req.cookies.token) {
    const token = jwt.decode(req.cookies.token)
    const {
      id
    } = token
    knex('favorites')
      .where('user_id', id)
      .select('favorites.id', 'favorites.book_id', 'favorites.user_id', 'books.created_at', 'books.updated_at', 'books.title', 'books.author', 'books.genre', 'books.description', 'books.cover_url')
      .join('books', 'favorites.book_id', 'books.id')
      .then((favorites) => {
        res.json(humps.camelizeKeys(favorites))
      })
  } else {
    res.status(401).type('text/plain').send('Unauthorized')
  }
})

router.get('/check', (req, res, next) => {
  if (req.cookies.token) {
    const token = jwt.decode(req.cookies.token)
    const {
      id
    } = token
    knex('favorites')
      .where('user_id', id)
      .join('books', 'books.id', 'favorites.book_id')
      .where('book_id', req.query.bookId)
      .then((result) => {
        if (result.length < 1) {
          res.json(false)
        } else {
          if (parseInt(req.query.bookId) === result[0].book_id) {
            res.json(true)
          } else {
            res.json(false)
          }
        }
      })
  } else {
    res.status(401).type('text/plain').send('Unauthorized')
  }
})

router.post('/', (req, res, next) => {
  if (req.cookies.token) {
    const token = jwt.decode(req.cookies.token)
    const {
      id
    } = token
    knex('favorites')
      .insert({
        book_id: req.body.bookId,
        user_id: id
      })
      .returning(['id', 'book_id', 'user_id'])
      .then((newFavorite) => {
        res.json(humps.camelizeKeys(newFavorite[0]))
      })
  } else {
    res.status(401).type('text/plain').send('Unauthorized')
  }
})

router.delete('/', (req, res, next) => {
  if (req.cookies.token) {
    const token = jwt.decode(req.cookies.token)
    const {
      id
    } = token
    knex('favorites')
      .where({
        book_id: req.body.bookId
      })
      .del()
      .returning(['book_id', 'user_id'])
      .then((result) => {
        res.json(humps.camelizeKeys(result[0]))
      })
  } else {
    res.status(401).type('text/plain').send('Unauthorized')
  }
})

module.exports = router;
