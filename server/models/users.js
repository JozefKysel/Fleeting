const db = require('./');

exports.set = (email, username, password, gender) => {
  db.conn.collection('users').insertOne({
    email,
    username,
    password,
    gender,
    callLengthLogs: [],
    contacts: []
  });
};

exports.get = (username) => {
  db.conn.collection('users').findOne({
    username
  });
};
