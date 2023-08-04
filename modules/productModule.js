const db = require("../database/db");
const { MongoClient, ObjectId } = require("mongodb");

module.exports.getAllProducts = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection = req.app.locals.db.collection("products");
      const products = await collection.find({}).toArray();
      resolve(products);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getProductById = (Id) => {
  return new Promise(async (resolve, reject) => {
    db.getProducts()
      .then((data) => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};

module.exports.addProduct = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection = req.app.locals.db.collection("products");
      const insertResult = await collection.insertOne(req.body);
      resolve(insertResult);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.editProduct = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection = req.app.locals.db.collection("products");

      const filter = { _id: new ObjectId(req.body._id) };
      const { _id, ...changeObject } = req.body;
      const updateResult = await collection.updateOne(filter, {
        $set: changeObject,
      });
      console.log(req.body._id);
      resolve(updateResult);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.deleteProduct = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection = req.app.locals.db.collection("users");
      const filter = { _id: new ObjectId(req.body._id) };
      const deleteResult = await collection.deleteOne(filter);
      resolve(deleteResult);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports.validateProductPayload = (product) => {
  if (!product.modelId) {
    throw Error("Model ID is mandatory ");
  }

  if (!product.modelName) {
    throw Error("Model Name is mandatory and should be unique");
  }
  if (!product.price) {
    throw Error("Model Price is mandatory   ");
  }
};
