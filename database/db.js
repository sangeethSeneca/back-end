const fs = require("fs");
class Data {
  products;
  orders;

  constructor(products, orders) {
    this.products = products;
    this.orders = orders;
  }

  addProduct(product) {
    this.products.push(product);
  }
  editProductInfo(index, product) {
    let productsList = [...this.products];

    productsList[index] = product;
    this.products = productsList;
  }
  deleteProduct(index) {
    let productsList = [...this.products];

    productsList.splice(index, 1);
    this.products = productsList;
  }
}
var dataCollection = null;

module.exports.initialize = () => {
  return new Promise(function (resolve, reject) {
    fs.readFile("./data/products.json", "utf8", (err, dataFromProductFile) => {
      if (err) {
        reject("unable to read students.json");
        return;
      }
      fs.readFile("./data/orders.json", "utf8", (err, dataFromOrdersFile) => {
        if (err) {
          reject("unable to read courses.json");
          return;
        }
        let productDataFromFile = JSON.parse(dataFromProductFile); // convert the JSON from the file into an array of objects
        let orderDataFromFile = JSON.parse(dataFromOrdersFile); // convert the JSON from the file into an array of objects

        dataCollection = new Data(productDataFromFile, orderDataFromFile);

        resolve(dataCollection);
      });
    });
  });
};

module.exports.getOrders = () => {
  return new Promise(function (resolve, reject) {
    resolve(dataCollection.orders);
  });
};

module.exports.getProducts = () => {
  return new Promise(function (resolve, reject) {
    resolve(dataCollection.products);
  });
};

module.exports.addProduct = (product) => {
  return new Promise(function (resolve, reject) {
    dataCollection.addProduct(product);
    resolve(dataCollection.products);
  });
};

module.exports.editProduct = (payload) => {
  return new Promise(function (resolve, reject) {
    let index = dataCollection.products.findIndex(
      (product) => product.id === payload.id
    );
    dataCollection.editProductInfo(index, payload);

    resolve(dataCollection.products);
  });
};

module.exports.deleteProduct = (payload) => {
  return new Promise(function (resolve, reject) {
    let index = dataCollection.products.findIndex(
      (product) => product.id === payload.id
    );
    dataCollection.deleteProduct(index);

    resolve(dataCollection.products);
  });
};
