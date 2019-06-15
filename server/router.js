const router = require('express').Router();
const controller = require('./controller');

router.post('/signup', controller.postNewUser);

module.exports = router;
