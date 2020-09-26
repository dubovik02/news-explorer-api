const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

// Поиск по ИД
module.exports.findUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь c ID ${req.user._id} не существует`);
      } else {
        res.status(200).send(user);
      }
    })
    .catch(next);
};
