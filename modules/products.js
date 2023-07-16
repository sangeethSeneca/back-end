const db = require("../database/db");

module.exports.getAllProducts = () => {
  return new Promise(async (resolve, reject) => {
    db.getProducts()
      .then((data) => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getProductById = (Id) => {
  return new Promise(async (resolve, reject) => {
    db.getProducts()
      .then((data) => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};
