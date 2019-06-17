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

exports.get = async username => {
  try {
    const searchExpression = new RegExp(username, 'i');
    const response = await db.conn.collection('users').findOne({
    username: {
      $regex: searchExpression
    }
    });
    return response;
  } catch(e) {
    console.log(e);
  }
};

exports.update = (username, property) => {
  const response = db.conn.collection('users').findOneAndUpdate(
    { username },
    { $set: {contacts: property }}
  );
  return response;
};
