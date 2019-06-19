const db = require('./');


exports.set = async (email, username, password, gender) => {
  try {
    return await db.conn.collection('users').insertOne({
      email,
      username,
      password,
      gender,
      callLengths: [],
      contacts: []
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getByEmail = async email => {
  try {
    return await db.conn.collection('users').findOne({
      email: email
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getByUsername = async username => {
  try {
    return await db.conn.collection('users').findOne({
      username: username
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getSearch = async username => {
  try {
    return await db.conn.collection('users').find({
      username: {
        $regex: RegExp(username, 'i')
      }
    }).toArray();
  } catch(error) {
    console.log(error);
  }
};

exports.updateContacts = async (username, newContact) => {
  return await db.conn.collection('users').findOneAndUpdate(
    { username },
    { $push: { contacts: newContact }}
  );
};

exports.deleteUser = async username => {
  return await db.conn.collection('users').deleteOne(
    { username }
  );
};
