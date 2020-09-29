/* eslint-disable max-len */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError');
const errMsg = require('../config/messages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// Поиск пользователя по email
userSchema.statics.findUserByEmail = function findByEmail(email) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (user) {
        return user;
      }
      return null;
    })
    .catch((err) => Promise.reject(err));
};

// Поиск пользователя по email и паролю
userSchema.statics.findUserByCredentials = function findByCredentials(email, password) {
  return this.findUserByEmail(email)
    .then((user) => {
      if (user) {
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              return Promise.reject(new UnauthorizedError(errMsg.ERR_MESSAGE_INVALID_USER_DETAILS));
            }
            return user;
          });
      }
      return Promise.reject(new UnauthorizedError(errMsg.ERR_MESSAGE_INVALID_USER_DETAILS));
    })
    .catch((err) => Promise.reject(err));
};

module.exports = mongoose.model('user', userSchema);
