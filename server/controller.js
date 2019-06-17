const users = require('./models/users');
const atob = require('atob');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postSignupUser = async (req, res) => {
  try {
    const decoded = atob(req.headers.authorization.split(' ')[1]);
    let [ username, password ] = decoded.split(':');
    password = await bcrypt.hash(password, 10);
    const setUser = await users.set(req.body.email, username, password, req.body.gender);
    res.json({ setUser });
    res.status(201).end();
  } catch (error) {
    res.status(500).end();
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
            ? jwt.sign({user}, 'secretkey', (_, token) => res.json({ token, user }).status(200).end())
            : res.status(403).end();
        })
      : res.status(403).end();
  } catch (error) {
    res.status(500).end();
  }
};

exports.getUserData = async (req, res) => {
  try {
    jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
    req.headers.username
      ? res.json({ user: await users.get(req.headers.username) }).status(200).end()
      : res.status(403).end();
  } catch (error) {
    res.status(500).end();
  }
};

exports.putNewContact = async (req, res) => {
  try {
    jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
    if (req.body.newContact && req.headers.username) {
      const contacts = await users.get(req.headers.username).contacts;
      contacts.push(newContact);
      await users.update(username, contacts);
      res.json({ contacts });
    } else res.status(500).end();
  } catch (error) {
    res.status(500).end();
  }
};

exports.putNewCallLength = async (req, res) => {
  try {
    jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
    if (req.body.newCallLength && req.headers.username) {
      const callLengths = await users.get(req.headers.username).callLengths;
      callLengths.push(newCallLength);
      await users.update(username, callLengths);
      res.json({ callLengths });
    } else res.status(500).end();
  } catch (error) {
    res.status(500).end();
  }
};
