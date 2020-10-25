const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/UnauthorizedError');
const config = require('../config/config');
const errMsg = require('../config/messages');

const { JWT_SECRET } = config;

// Login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new UnauthorizedError(errMsg.ERR_MESSAGE_EMPTY_USER_DETAILS));
    return;
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: 3600 * 24 * 7 });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
        .send({
          jwt: token, id: user._id, name: user.name, email: user.email,
        });
    })
    .catch(next);
};
