'use strict';

const express = require('express')
const jwt = require('jsonwebtoken')
const humps = require('humps')
const knex = require('../knex')
const bcrypt = require('bcrypt')
const boom = require('boom')

// eslint-disable-next-line new-cap
const router = express.Router()
const key = process.env.JWT_KEY

console.log(key)

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
  const {email, password} = req.body

  knex('users')
    .select('*')
    .where('email', email)
    .then((rows) => {
      if(rows.length > 0){
        return rows[0]
      }else{
        next(boom.badRequest('Bad email or password'))
      }
    })
    .then((users) => {
      bcrypt.compare(password, users.hashed_password, (err, response) => {
        if (response) {
          const userData = {
            first_name: users.first_name,
            last_name: users.last_name,
            email: users.email,
            id: users.id
          }
          const signedUser = jwt.sign({data: email}, password)

          res.setHeader('Set-Cookie', `token=${signedUser}; Path=\/; +HttpOnly`)
          res.status(200).json(humps.camelizeKeys(userData))
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
