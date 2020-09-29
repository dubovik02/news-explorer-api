const router = require('express').Router();
const auth = require('../middlewares/auth');

const createUserRouter = require('./signup');
const loginRouter = require('./signin');
const usersRouter = require('./users');
const articlesRouter = require('./articles');

router.use('/signup', createUserRouter);
router.use('/signin', loginRouter);
router.use(auth);
router.use('/users', usersRouter);
router.use('/articles', articlesRouter);

module.exports = router;
