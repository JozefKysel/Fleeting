const db = require('./');

exports.set = ({ email, username, password, gender }) => db.conn.collection('users').insert({
  email,
  username,
  password,
  gender,
  callLengthLogs: [],
  contacts: []
});