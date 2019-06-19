const users = require('./models/users');
const atob = require('atob');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

exports.postSignupUser = async (req, res) => {
  try {
    const decoded = atob(req.body.authorization.split(' ')[1]);
    let [ username, password ] = decoded.split(':');
    password = await bcrypt.hash(password, 10);
    
    const usernameAlreadyExists = await users.getByUsername(username);
    const emailAlreadyExists = await users.getByEmail(req.body.email);

    if (usernameAlreadyExists) {
      res.status(409);
      res.json({error: 'Username already exists'});
    } else if (emailAlreadyExists) {
      res.status(200);
      res.json({error: 'There already is an account connected to this email address'});
    } else {
      const setUser = await users.set(req.body.email, username, password, req.body.gender);
      const userData = setUser.ops[0];
      setUser && userData
        ? res.status(201) && res.json({ userData })
        : res.status(500).end();
    }
  } catch (error) {
    res.status(500).end();
  }
};

exports.postLoginUser = async (req, res) => {
  try {
    const decoded = atob(req.headers.authorization.split(' ')[1]);
    const [ username, password ] = decoded.split(':');
    const user = await users.getByUsername(username);

    if (! user) {
      res.status(403).end();
    } else if (user._id && user.email && user.password) {
      const userInfo = { _id: user._id, email: user.email };
      bcrypt.compare(password, user.password, (_, same) => {
        same === true
          ? jwt.sign({userInfo}, 'secretkey', (_, token) => res.status(200).json({ token }))
          : res.status(403).end();
      });
    } else {
      res.status(500).end();
    }
  } catch (error) {
    res.status(500).end();
  }
};

exports.getUserData = async (req, res) => {
  try {
    jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
    const result = await users.getByEmail(req.params.email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).end();
  }
}

exports.getSearch = async (req, res) => {
  try {
    jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
    const decoded = jwtDecode(req.token);
    const result = await users.getSearch(req.params.username);
    const filteredResult = result.filter(user => String(user._id) !== decoded.userInfo._id);
    res.status(200).json(filteredResult);
  } catch (error) {
    res.status(500).end();
  }
}

exports.putNewContact = async (req, res) => {
  try {
    const newContact = req.body;
    if (! newContact) res.status(409).end();

    const newContactUserExists = await users.getByEmail(newContact.email);
    if (! newContactUserExists) res.status(404).end();

    jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
    const decoded = jwtDecode(req.token);
    const loggedInUser = await users.getByEmail(decoded.userInfo.email);
    const userAlreadyInContacts = loggedInUser.contacts.some(user => user.email === newContact.email);

    if (! userAlreadyInContacts && newContact.email !== decoded.userInfo.email) {
      await users.updateContacts(decoded.userInfo.email, newContact);
      const result = await users.getByEmail(decoded.userInfo.email);
      const { contacts } = result;
      res.status(200).json({ contacts });
    } else if (userAlreadyInContacts || newContact.email === decoded.userInfo.email) {
      res.status(409).end();
    } else {
      res.status(500).end();
    }
  } catch (error) {
    res.status(500).end();
  }
};

exports.deleteUserAccount = async (req, res) => {
  try {
    jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
    
    const decoded = atob(req.headers.authorizationfordelete.split(' ')[1]);
    const [ username, password ] = decoded.split(':');
    const user = await users.getByUsername(username);

    if (user) {
      bcrypt.compare(password, user.password, async (_, same) => {
        if (same === true) {
          const result = await users.deleteUser(username);
          res.status(200);
          res.json(result);
        } else {
          res.status(403).end();
        }
      });
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).end();
  }
};
