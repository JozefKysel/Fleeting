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
    const result = await db.conn.collection('users').findOne({
      email: email
    });
    return result;
  } catch(e) {
    console.log(e);
  }
};

exports.get = async username => {
  try {
    const searchExpression = new RegExp(username, 'i');
    const result = await db.conn.collection('users').findOne({
      username: {
        $regex: searchExpression
      }
    });
    return result;
  } catch(e) {
    console.log(e);
  }
};

exports.getByEmail = async email => {
  try {
    const searchExpression = new RegExp(email, 'i');
    const result = await db.conn.collection('users').findOne({
      email: {
        $regex: searchExpression
      }
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

exports.update = async (username, property) => {
  const result = await db.conn.collection('users').findOneAndUpdate(
    { username },
    { $set: {contacts: property }}
  );
  return result;
};

exports.delete = async username => {
  const result = await db.conn.collection('users').deleteOne(
    { username }
  );
  return result;
};
