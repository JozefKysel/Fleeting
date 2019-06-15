const MongoClient = require('mongodb').MongoClient;
const db = {};

const dbUrl = 'mongodb://localhost:27017';
const dbName = 'fleeting';

db.MongoClient = new MongoClient(dbUrl, { useNewUrlParser: true });

db.MongoClient.connect(error => {
  if (error) throw new Error(error);
  db.conn = db.MongoClient.db(dbName);
  console.log(`Connected to database ${dbName}`);
});

module.exports = db;