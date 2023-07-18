const fs = require("fs");
class Data {
  products;
  orders;
  categories;
  users;

  constructor(products, orders, categories, users) {
    this.products = products;
    this.orders = orders;
    this.categories = categories;
    this.users = users;
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

  //orders

  addOrder(order) {
    this.orders.push(order);
  }
  editOrderInfo(index, order) {
    let orderList = [...this.orders];

    orderList[index] = order;
    this.orders = orderList;
  }
  deleteOrder(index) {
    let orderList = [...this.orders];

    orderList.splice(index, 1);
    this.orders = orderList;
  }

  ///categories
  addCategory(category) {
    this.categories.push(category);
  }
  editCategoryInfo(index, category) {
    let categoriesList = [...this.categories];

    categoriesList[index] = category;
    this.categories = categoriesList;
    console.log(index);
  }
  deleteCategory(index) {
    let categoriesList = [...this.categories];

    categoriesList.splice(index, 1);
    this.categories = categoriesList;
  }

  //users
  addUser(user) {
    this.users.push(user);
  }
  editUserInfo(index, user) {
    let userList = [...this.users];

    userList[index] = user;
    this.users = userList;
  }
  deleteUser(index) {
    let userList = [...this.users];

    userList.splice(index, 1);
    this.users = userList;
  }
}
var dataCollection = null;

module.exports.initialize = () => {
  let userData;
  let categoryData;
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
        fs.readFile("./data/users.json", "utf8", (err, data) => {
          userData = JSON.parse(data);
          fs.readFile(
            "./data/categories.json",
            "utf8",
            (err, dataFromCategoryFile) => {
              categoryData = JSON.parse(dataFromCategoryFile);
              let productDataFromFile = JSON.parse(dataFromProductFile); // convert the JSON from the file into an array of objects
              let orderDataFromFile = JSON.parse(dataFromOrdersFile); // convert the JSON from the file into an array of objects
              console.log(userData);
              dataCollection = new Data(
                productDataFromFile,
                orderDataFromFile,
                categoryData,
                userData
              );

              resolve(dataCollection);
            }
          );
        });
      });
    });
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

//orders

module.exports.getOrders = () => {
  return new Promise(function (resolve, reject) {
    resolve(dataCollection.orders);
  });
};

module.exports.addOrder = (order) => {
  return new Promise(function (resolve, reject) {
    dataCollection.addOrder(order);
    resolve(dataCollection.order);
  });
};

module.exports.editOrder = (payload) => {
  return new Promise(function (resolve, reject) {
    let index = dataCollection.orders.findIndex(
      (order) => order.id === payload.id
    );
    dataCollection.editOrderInfo(index, payload);

    resolve(dataCollection.orders);
  });
};

module.exports.deleteOrder = (payload) => {
  return new Promise(function (resolve, reject) {
    let index = dataCollection.orders.findIndex(
      (order) => order.id === payload.id
    );
    dataCollection.deleteOrder(index);

    resolve(dataCollection.orders);
  });
};

//categories

module.exports.getCategories = () => {
  return new Promise(function (resolve, reject) {
    resolve(dataCollection.categories);
  });
};

module.exports.addCategory = (category) => {
  return new Promise(function (resolve, reject) {
    dataCollection.addCategory(category);
    resolve(dataCollection.categories);
  });
};

module.exports.editCategory = (payload) => {
  return new Promise(function (resolve, reject) {
    let index = dataCollection.categories.findIndex(
      (category) => category.categoryId === payload.categoryId
    );
    dataCollection.editCategoryInfo(index, payload);

    resolve(dataCollection.categories);
  });
};

module.exports.deleteCategory = (payload) => {
  return new Promise(function (resolve, reject) {
    let index = dataCollection.categories.findIndex(
      (category) => category.id === payload.id
    );
    dataCollection.deleteOrder(index);

    resolve(dataCollection.categories);
  });
};

/// users

module.exports.getUsers = () => {
  return new Promise(function (resolve, reject) {
    resolve(dataCollection.users);
  });
};

module.exports.addUser = (user) => {
  return new Promise(function (resolve, reject) {
    dataCollection.addUser(user);
    resolve(dataCollection.users);
  });
};

module.exports.editUser = (payload) => {
  return new Promise(function (resolve, reject) {
    let index = dataCollection.users.findIndex(
      (user) => user.id === payload.id
    );
    dataCollection.editUser(index, payload);

    resolve(dataCollection.users);
  });
};

module.exports.deleteUser = (payload) => {
  return new Promise(function (resolve, reject) {
    let index = dataCollection.users.findIndex(
      (user) => user.id === payload.id
    );
    dataCollection.deleteUser(index);

    resolve(dataCollection.users);
  });
};
