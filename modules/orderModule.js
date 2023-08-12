const db = require("../database/db");

module.exports.getAllOrders = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection = req.db.collection("orders");
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

module.exports.addOrder = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection = await req.db.collection("orders");
      const insertResult = await collection.insertOne(req.body);
      resolve(insertResult);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.editOrder = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection = await req.db.collection("orders");

      const filter = { _id: new ObjectId(req.body._id) };
      const { _id, ...changeObject } = req.body;
      const updateResult = await collection.updateOne(filter, {
        $set: changeObject,
      });
      resolve(updateResult);
    } catch (error) {
      console.log(error);
      reject(error);
    }
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
