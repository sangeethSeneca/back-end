const { ObjectId } = require("mongodb");
const db = require("../database/db");

module.exports.getAllUsers = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection = await req.db.collection("users");
      const users = await collection.find({}).toArray();
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getUserById = (Id) => {
  return new Promise(async (resolve, reject) => {
    db.getUserById()
      .then((data) => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};

module.exports.addUser = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection = req.db.collection("users");
      const insertResult = await collection.insertOne(req.body);
      resolve(insertResult);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.editUser = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.editUser(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returned"));
  });
};

module.exports.deleteUser = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection = req.db.collection("users");
      const filter = { _id: new ObjectId(req.body._id) };
      const deleteResult = await collection.deleteOne(filter);
      resolve(deleteResult);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.validateUserPayload = (user) => {
  if (!user.userId) {
    throw Error("User ID is mandatory.");
  }
  if (!user.userName) {
    throw Error("User Name is mandatory");
  }
  if (!user.email) {
    throw Error("User Email is mandatory");
  }
};
