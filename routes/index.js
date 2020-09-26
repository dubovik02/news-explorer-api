const createUserRouter = require('./signup');
const loginRouter = require('./signin');
const usersRouter = require('./users');
const articlesRouter = require('./articles');

module.exports = {
  createUserRouter, loginRouter, usersRouter, articlesRouter,
};
