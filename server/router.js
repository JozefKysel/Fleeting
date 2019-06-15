const router = require('express').Router();
const controller = require('./controller');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else res.sendStatus(403);
};

router.post('/signup', controller.postNewUser);
router.post('/login', controller.postLoginUser);
router.post('/test', verifyToken, controller.postSthElse);

module.exports = router;
