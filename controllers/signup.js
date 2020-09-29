const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const errMsg = require('../config/messages');

const PASS_LENGTH = 8;

// Создание
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  try {
    // если пароль не задан, пароль перед сохранением не захишируем -
    // создание не возможно.
    if (!password) {
      throw new BadRequestError(errMsg.ERR_MESSAGE_PASS_REQUIRE);
    }

    // пароль не может состоять из пробелов
    if (!password.split(' ').join('').length) {
      throw new BadRequestError(errMsg.ERR_MESSAGE_SPACES_ALLOW);
    }

    // проверка длины пароля
    if (password.length < PASS_LENGTH) {
      throw new BadRequestError(errMsg.ERR_MESSAGE_PASS_LENGTH + PASS_LENGTH);
    }
  } catch (err) {
    next(err);
    return;
  }

  User.findUserByEmail(email)
    .then((user) => {
      if (user) {
        throw new ConflictError(errMsg.ERR_MESSAGE_USER_EXISTS);
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name, email, password: hash,
          })
            .then((newUser) => {
              res.status(200).send({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
              });
            })
            .catch((err) => {
              next(err);
            }));
      }
    })
    .catch(next);
};
