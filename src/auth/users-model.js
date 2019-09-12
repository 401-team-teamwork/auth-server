'use strict';

/**
 * User Model
 * @module src/auth/users-model
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  stats: [],
});

/**
 * Before Save fx() is run hash the password
 * @param  {} 'save'
 * @param  {} function(next
 * @param  {} {bcrypt.hash(this.password
 * @param  {} 10
 * @param  {} .then(hashedPassword=>{this.password=hashedPassword;next(
 * @param  {} ;}
 * @param  {} .catch(console.error
 * @param  {} ;}
 */
users.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(console.error);
});

/**
 * Authentication for username and password
 * @param auth
 * @returns {Promise<unknown>}
 */
users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};

/**
 * Checks if the given token is tied to an _id
 * @param token
 * @returns {Promise<never>|void|Query}
 */
users.statics.authenticateToken = function(token){
  try {
    let parsedToken = jwt.verify(token, SECRET);
    let query = {_id: parsedToken.id};
    return this.findOne(query);
  }
  catch (error) {
    throw new Error('Invalid Token');
  }
};

/**
 * 
 * @param password
 * @returns {Promise<unknown>}
 */
users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

/**
 * Creates a token that is tied to a user._id
 * @param type
 * @returns {undefined|*}
 */
users.methods.generateToken = function(type) {
  let token = {
    id: this._id,
    type: type || 'regular',
  };
  return jwt.sign(token, SECRET,);
};

module.exports = mongoose.model('users', users);
