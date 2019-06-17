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
<<<<<<< HEAD
            ? jwt.sign({user}, 'secretkey', (_, token) => res.json({ token, user }))
=======
            ? jwt.sign({user}, 'secretkey', (_, token) => res.json({ token, user }).status(200).end())
>>>>>>> 17deaba109e87f946f4b152264fe556f20df1681
            : res.status(403).end();
        })
      : res.status(403).end();
  } catch (error) {
    res.status(500).end();
  }
};

exports.getAll = async (req, res) => {
  console.log(req);
  try {
    jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
<<<<<<< HEAD
    res.json(await users.get(req.params.username));
  } catch (e) {
    console.log(e)
=======
    req.headers.username
      ? res.json({ user: await users.get(req.headers.username) }).status(200).end()
      : res.status(403).end();
  } catch (error) {
>>>>>>> 17deaba109e87f946f4b152264fe556f20df1681
    res.status(500).end();
  }
}

// exports.getUserData = async (req, res) => {
//   try {
//     jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
//     req.headers.username
//       ? res.json({ user: await users.get(req.headers.username) })
//       : res.status(500).end();
//   } catch (error) {
//     res.status(500).end();
//   }
// };

exports.putNewContact = async (req, res) => {
  const { username } = req.params;
  const newContact = req.body;
  try {
    jwt.verify(req.token, 'secretkey', error => error && res.status(403).end());
    if (newContact && username) {
      const user = await users.get(username);
      user.contacts.push(newContact);
      const contacts = user.contacts;
      const response = await users.update(username, user.contacts);
      res.status(200).json({ contacts });
    }
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
