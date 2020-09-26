const router = require('express').Router();
const { findUserById } = require('../controllers/users');

router.get('/me', findUserById);

module.exports = router;
