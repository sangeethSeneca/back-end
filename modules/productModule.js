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

module.exports.addProduct = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.addProduct(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returned"));
  });
};

module.exports.editProduct = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.editProduct(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returned"));
  });
};

module.exports.deleteProduct = (payload) => {
  return new Promise(async (resolve, reject) => {
    db.deleteProduct(payload)
      .then((data) => resolve(payload))
      .catch(() => reject("no results returneds"));
  });
};
module.exports.validateProductPayload = (product) => {
  if (!product.modelId) {
    throw Error("Model ID is mandatory");
  }
  
  if (!product.modelName) {
    throw Error("Model Name is mandatory");
  }
  if (!product.price) {
    throw Error("Model Price is mandatory");
  }
};
