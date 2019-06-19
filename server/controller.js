const users = require('./models/users');
const atob = require('atob');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    ! user && res.status(403).end();

    const { _id, email } = user;
    const userInfo = {
      _id,
      email
    };
    userInfo && bcrypt.compare(password, user.password, (_, same) => {
      same === true
        ? jwt.sign({userInfo}, 'secretkey', (_, token) => res.status(200).json({ token }))
        : res.status(403).end();
    });
  } catch (error) {
    res.status(500).end();
  }
};

exports.getUserData = async (req, res) => {
  try {
    jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
    const response = await users.getByEmail(req.params.email);
    res.status(200).json(response);
  } catch (e) {
    res.status(500);
  }
}

exports.getSearch = async (req, res) => {
  try {
    jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
    res.json(await users.getSearch(req.params.username));
  } catch (e) {
    res.status(500);
  }
}

exports.putNewContact = async (req, res) => {
  const { username } = req.params;
  const newContact = req.body;
  try {
    jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
    if (newContact && username) {
      const result = await users.updateContacts(username, newContact);
      const contacts = result.contacts;
      res.status(200).json({ contacts });
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
    
    user
      ? bcrypt.compare(password, user.password, async (_, same) => {
          if (same === true) {
            const result = await users.deleteUser(username);
            res.status(200);
            res.send(result);
          } else {
            res.status(403).end();
          }
        })
      : res.status(403).end();
  } catch (error) {
    res.status(500).end();
  }
};
