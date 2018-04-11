'use strict';

const express = require('express')
const jwt = require('jsonwebtoken')
const humps = require('humps')
const knex = require('../knex')
const bcrypt = require('bcrypt')

// eslint-disable-next-line new-cap
const router = express.Router()
const key = process.env.JWT_KEY

router.get('/', (req, res, next) => {
  if(!req.cookies.token){
    res.status(200).json(false)
  }else if(req.cookies.token){
    res.status(200).json(true)
  }else{
    next()
  }
})

router.post('/', (req, res, next) => {
  const user = {
    email: req.body.email
  }
  knex('users')
    .then((users) => {
      bcrypt.compare(req.body.password, users[0].hashed_password, (err, response) => {
        if (req.body.email === users[0].email && response) {
          user.id = users[0].id
          user.firstName = users[0].first_name
          user.lastName = users[0].last_name
          const signedUser = jwt.sign(user, key)
          res.cookie('token', signedUser, { path: '/', httpOnly: true }).json(user)
        } else {
          res.status(400).type('text/plain').send('Bad email or password')
        }
      })
    })
})

router.delete('/', (req, res, next) => {
  res.cookie('token', '').json(true)
})
module.exports = router
