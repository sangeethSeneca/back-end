const db = require("../database/db");

module.exports.getAllCategories = () => {
  return new Promise(async (resolve, reject) => {
    db.getCategories()
      .then((data) => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getCategoryById = (Id) => {
  return new Promise(async (resolve, reject) => {
    db.getCategoryById()
      .then((data) => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};

module.exports.addCategory = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.addCategory(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returned"));
  });
};

module.exports.editCategory = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.editCategory(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returned"));
  });
};

module.exports.deleteCategory = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.deleteCategory(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returned"));
  });
};
