const users = require('./models/users');
const atob = require('atob');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postNewUser = async (req, res) => {
  try {
    const decoded = atob(req.headers.authorization.split(' ')[1]);
    let [ username, password ] = decoded.split(':');
    password = await bcrypt.hash(password, 10);
    const setUser = await users.set(req.body.email, username, password, req.body.gender);
    res.json(setUser);
    res.status(200);
  } catch (error) {
    res.status(500);
  }
};

exports.postLoginUser = async (req, res) => {
  try {
    const decoded = atob(req.headers.authorization.split(' ')[1]);
    const [ username, password ] = decoded.split(':');
    const user = await users.get(username);
    user
      ? bcrypt.compare(password, user.password, (_, same) => {
          same === true
            ? jwt.sign({user}, 'secretkey', (_, token) => res.json({ token }))
            : res.status(403).end();
        })
      : res.status(403).end();
  } catch (error) {
    res.status(500);
  }
};

exports.postSthElse = async (req, res) => {
  jwt.verify(req.token, 'secrekey', (err, authData) => {
    if (error) res.status(403);
    else res.json({ message: 'post created', authData });
  });
};
