const db = require("../database/db");

module.exports.getAllOrders = () => {
  return new Promise(async (resolve, reject) => {
    db.getOrders()
      .then((data) => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getOrderById = (Id) => {
  return new Promise(async (resolve, reject) => {
    db.getAllOrders()
      .then((data) => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};
