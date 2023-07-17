const db = require("../database/db");

module.exports.getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    db.getUsers()
      .then((data) => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getUserById = (Id) => {
  return new Promise(async (resolve, reject) => {
    db.getUserById()
      .then((data) => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};

module.exports.addUser = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.addUser(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returned"));
  });
};

module.exports.editUser = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.editUser(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returned"));
  });
};

module.exports.deleteUser = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.deleteUser(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returned"));
  });
};
