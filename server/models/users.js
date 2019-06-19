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
    throw Error(error);
  }
};

exports.getByEmail = async email => {
  try {
    return await db.conn.collection('users').findOne({
      email: email
    });
  } catch (error) {
    throw Error(error);
  }
};

exports.getByUsername = async username => {
  try {
    return await db.conn.collection('users').findOne({
      username: username
    });
  } catch (error) {
    throw Error(error);
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
    throw Error(error);
  }
};

exports.updateContacts = async (email, newContact) => {
  try {
    return await db.conn.collection('users').findOneAndUpdate(
      { email },
      { $push: { contacts: newContact }}
    );
  } catch (error) {
    throw Error(error);
  }
};

exports.deleteUser = async username => {
  try {
    return await db.conn.collection('users').deleteOne(
      { username }
    );
  } catch (error) {
    throw Error(error);
  }
};
