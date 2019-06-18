const router = require('express').Router();
const controller = require('./controller');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else res.status(403).end();
};

router.post('/signup', controller.postSignupUser);
router.post('/login', controller.postLoginUser);
router.get('/search/:username', verifyToken, controller.getAll);
router.put('/add/:username', verifyToken, controller.putNewContact);
router.get('/user/:email', verifyToken, controller.getData);
// router.put('/call-done', verifyToken, controller.putNewCallLength);

module.exports = router;
