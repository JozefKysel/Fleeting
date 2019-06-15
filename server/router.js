const router = require('express').Router();
const controller = require('./controller');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else res.status(403).end();
};

router.post('/signup', controller.postSignupUser);
router.post('/login', controller.postLoginUser);
router.get('/home', verifyToken, controller.getUserData);
// router.put('/add', verifyToken, controller.putNewContact);
// router.put('/call-done', verifyToken, controller.putNewCallLength);

module.exports = router;
