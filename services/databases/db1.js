const config = require("../../config");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = () => {
  return new Promise((resolve, reject) => {
    mongoClient
      .connect(config.DB1_HOST, {
        useUnifiedTopology: true,
        connectTimeoutMS: 5000,
      })
      .then((client) => {
        _db = client.db(config.DB1_NAME);
        resolve(_db);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const collection = (name) => {
  return _db.collection(name);
};

module.exports.mongoConnect = mongoConnect;
module.exports.collection = collection;
