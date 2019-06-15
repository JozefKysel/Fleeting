const db = require('./');

exports.set = (email, username, password, gender) => {
  return db.conn.collection('users').insertOne({
    email,
    username,
    password,
    gender,
    callLengths: [],
    contacts: []
  });
};

exports.get = username => {
  return db.conn.collection('users').findOne({
    username
  });
};

exports.update = (username, property) => {
  return db.conn.collection('users').findOneAndUpdate(
    { username },
    { property }
  );
};
