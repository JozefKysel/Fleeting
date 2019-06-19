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

exports.getByEmail = async email => {
  try {
    const result = await db.conn.collection('users').findOne({
      email: email
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

exports.getByUsername = async username => {
  try {
    const result = await db.conn.collection('users').findOne({
      username: username
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

exports.getSearch = async username => {
  try {
    const searchExpression = new RegExp(username, 'i');
    const result = await db.conn.collection('users').find({
      username: {
        $regex: searchExpression
      }
    }).toArray();
    return result;
  } catch(e) {
    console.log(e);
  }
};

exports.updateContacts = async (username, newContact) => {
  const result = await db.conn.collection('users').findOneAndUpdate(
    { username },
    { $push: { contacts: newContact }}
  );
  return result;
};

exports.deleteUser = async username => {
  const result = await db.conn.collection('users').deleteOne(
    { username }
  );
  return result;
};
