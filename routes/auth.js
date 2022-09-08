const express = require('express');
const ExpressError = require('../expressError'); 
const jwt = require('jsonwebtoken'); 
const { SECRET_KEY } = require('../config'); 
const User = require('../models/user'); 

const router = express.Router(); 

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post('/login', (req, res, next) => {
  try {
    const { username, password } = req.body; 
    if(!username, !password){
      throw new ExpressError("Username and password require", 400); 
    }

    if(!User.authenticate(username, password)){
      throw new ExpressError("Username or password incorrect", 400); 
    }


    User.updateLoginTimestamp(username); 

    const token = jwt.sign({ username }, SECRET_KEY); 
    return res.json({ token }); 

  } catch(err){
    return next(err); 
  }
})


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async (req, res, next) => {
  try {

    const { username } = User.register(req.body); 
    User.updateLoginTimestamp(username); 
    const token = jwt.sign({ username }, SECRET_KEY); 

    return res.json({ token }); 

  } catch(err) {
    return next(err); 
  }
})


module.exports = router;