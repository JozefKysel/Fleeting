const users = require('./models/users');
const atob = require('atob');
const bcrypt = require('bcrypt');

exports.postNewUser = async (req, res) => {
  try {
    const decoded = atob(req.headers.authorization.split(' ')[1]);
    let [ username, password ] = decoded.split(':');
    password = await bcrypt.hash(password, 10);
    await users.set(req.body.email, username, password, req.body.gender);
    res.status = 200;
  } catch (error) {
    res.status = 500;
  }
};