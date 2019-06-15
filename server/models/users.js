const db = require('./');

exports.set = (email, username, password, gender) => {
  return db.conn.collection('users').insertOne({
    email,
    username,
    password,
    gender,
    callLengthLogs: [],
    contacts: []
  });
};

exports.get = username => {
  return db.conn.collection('users').findOne({
    username
  });
};
