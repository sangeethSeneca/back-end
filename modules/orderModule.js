const db = require("../database/db");

module.exports.getAllOrders = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection = req.app.locals.db.collection("orders");
      const products = await collection.find({}).toArray();
      resolve(products);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports.getOrderById = (Id) => {
  return new Promise(async (resolve, reject) => {
    db.getAllOrders()
      .then((data) => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};

module.exports.addOrder = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.addOrder(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returned"));
  });
};

module.exports.editOrder = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.editOrder(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returned"));
  });
};

module.exports.deleteOrder = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.deleteOrder(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returned"));
  });
};

module.exports.validateOrderPayload = (order) => {
  if (!order.modelId) {
    throw Error("Order ID is mandatory");
  }
  if (!order.customerName) {
    throw Error("Customer Name is mandatory");
  }
  if (order?.products?.length === 0) {
    throw Error("Order cannot be empty");
  }
};
