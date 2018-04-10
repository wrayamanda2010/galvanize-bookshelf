'use strict';

const express = require('express')
const humps = require('humps')
const knex = require('../knex')
const bcrypt = require('bcrypt')


// eslint-disable-next-line new-cap
const router = express.Router()

router.post('/', (req, res, next) => {
  const saltInt = 10
  bcrypt.genSalt(saltInt, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (error, hash) => {
      knex('users')
        .insert(humps.decamelizeKeys({
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          hashed_password: hash
        }))
      .returning(['id', 'first_name', 'last_name', 'email'])
      .then((data) => {
        res.json(humps.camelizeKeys(data[0]))
      })
    })
  })
})

module.exports = router
