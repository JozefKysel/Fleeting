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

exports.getData = async email => {
  try {
    const response = await db.conn.collection('users').findOne({
      email: email
    });
    return response;
  } catch(e) {
    console.log(e);
  }
}

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

exports.update = async (username, property) => {
  const response = await db.conn.collection('users').findOneAndUpdate(
    { username },
    { $set: {contacts: property }}
  );
  return response;
};

exports.delete = async username => {
  const response = await db.conn.collection('users').findOneAndDelete(
    { username }
  );
  return response;
};
