const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const errMsg = require('../config/messages');

// Поиск по ИД
module.exports.findUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errMsg.ERR_MESSAGE_USER_NOT_FOUND);
      } else {
        res.status(200).send(user);
      }
    })
    .catch(next);
};
