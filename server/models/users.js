const db = require('./');

exports.set = (email, username, password, gender) => {
  console.log(email, username, gender);
  db.conn.collection('users').insertOne({
  email,
  username,
  password,
  gender,
  callLengthLogs: [],
  contacts: []
});
};
