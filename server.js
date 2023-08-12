/*********************************************************************************
 * WEB700 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students
 *
 * Name: E.A.R Sangeeth Perera Student ID: 178951216  Date: 07/04/2023
 *
 * Online (Cyclic) Link: https://wild-seal-sarong.cyclic.app/
 *
 ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8090;
var express = require("express");
var path = require("path");
var app = express();
const collegeDataModule = require("./modules/collegeData");
const productsDataModule = require("./modules/productModule");
const ordersDataModule = require("./modules/orderModule");
const categoriesDataModule = require("./modules/categoryModule");
const usersDataModule = require("./modules/usersModule");
const authRoutes = require("./routes/authRoutes");

const db = require("./database/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const connectDB = require("./database/dbConnect");
const { verifyToken } = require("./modules/common");
// setup http server to listen on HTTP_PORT
app.use(express.static("public"));
app.use("/images", express.static(__dirname + "/images"));
app.use(bodyParser.json());
app.use(cors());
app.use("/auth", authRoutes);
// Parse URL-encoded bodies for x-www-form-urlencoded content type
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.urlencoded({ extended: true }));

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute
            ? ' class="nav-item active" '
            : ' class="nav-item" ') +
          '><a class="nav-link" href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);

connectDB()
  .then((db) => {
    app.locals.db = db;
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

app.use(async (req, res, next) => {
  try {
    req.db = await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: "Database connection error" });
  }
});

app.set("view engine", ".hbs");

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  next();
});

app.get("/", (req, res) => {
  res.send("EVistra backend");
});

/////////////////////////////////////

app.get("/products", async (req, res) => {
  let product = req.query.product;
  if (product) {
    productsDataModule
      .getProductById(Number(product))
      .then((data) => {
        res.send({ products: data });
      })
      .catch((error) => {
        res.send({ message: error });
      });
  } else {
    productsDataModule
      .getAllProducts(req)
      .then((data) => {
        if (data.length > 0) {
          res.send({ products: data });
        }
      })
      .catch((error) => {
        res.send({ message: JSON.stringify(error) });
      });
  }
});

app.post("/products/add", verifyToken, (req, res) => {
  productsDataModule
    .addProduct(req)
    .then(() => res.send({ message: "Successfully Added" }))
    .catch((error) => {
      res.send({ error: "Something went wrong" });
    });
});

app.put("/products/edit", verifyToken, (req, res) => {
  productsDataModule
    .editProduct(req)
    .then(() => res.send({ message: "Successfully Edited" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.delete("/products/delete", verifyToken, (req, res) => {
  productsDataModule
    .deleteProduct(req)
    .then(() => res.send({ message: "Successfully Deleted" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.get("/orders", verifyToken, async (req, res) => {
  ordersDataModule
    .getAllOrders(req)
    .then((data) => {
      if (data.length > 0) {
        res.send({ orders: data });
      } else {
        res.send({ message: "no results" });
      }
    })
    .catch((error) => {
      res.send("courses", { message: "no results" });
    });
});

app.post("/orders/add", (req, res) => {
  ordersDataModule
    .addOrder(req)
    .then(() => res.send({ message: "Successfully Added" }))
    .catch((error) => {
      res.send({ error: "Something went wrong" });
    });
});

app.put("/orders/edit", (req, res) => {
  ordersDataModule
    .editOrder(req)
    .then(() => res.send({ message: "Successfully Edited" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.delete("/orders/delete", verifyToken, (req, res) => {
  ordersDataModule
    .deleteOrder(req)
    .then(() => res.send({ message: "Successfully Deleted" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.get("/users", verifyToken, async (req, res) => {
  let user = req.query.product;
  if (user) {
    usersDataModule
      .getUserById(Number(user))
      .then((data) => {
        res.send({ user: data });
      })
      .catch((error) => {
        res.send({ message: "no results" });
      });
  } else {
    usersDataModule
      .getAllUsers(req)
      .then((data) => {
        if (data.length > 0) {
          res.send({ users: data });
        }
      })
      .catch((error) => {
        res.send({ message: "no results" });
      });
  }
});

app.post("/users/add", verifyToken, (req, res) => {
  usersDataModule
    .addUser(req)
    .then(() => res.send({ message: "Successfully Added" }))
    .catch((error) => {
      res.send({ error: "Something went wrong" });
    });
});

app.put("/users/edit", verifyToken, (req, res) => {
  usersDataModule
    .editUser(req.body)
    .then(() => res.send({ message: "Successfully Edited" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.delete("/users/delete", verifyToken, (req, res) => {
  usersDataModule
    .deleteUser(req)
    .then(() => res.send({ message: "Successfully Deleted" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.get("/categories", async (req, res) => {
  let category = req.query.category;
  if (category) {
    categoriesDataModule
      .getCategoryById(Number(category))
      .then((data) => {
        res.send({ categories: data });
      })
      .catch((error) => {
        res.send({ message: "no results" });
      });
  } else {
    categoriesDataModule
      .getAllCategories()
      .then((data) => {
        if (data.length > 0) {
          res.send({ categories: data });
        }
      })
      .catch((error) => {
        res.send({ message: "no results" });
      });
  }
});

app.post("/category/add", (req, res) => {
  categoriesDataModule
    .addCategory(req.body)
    .then(() => res.send({ message: "Successfully Added" }))
    .catch((error) => {
      console.log(req.body);
      res.send({ error: error });
    });
});

app.put("/category/edit", (req, res) => {
  categoriesDataModule
    .editCategory(req.body)
    .then(() => res.send({ message: "Successfully Edited" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.delete("/category/delete", (req, res) => {
  categoriesDataModule
    .deleteCategory(req.body)
    .then(() => res.send({ message: "Successfully Deleted" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.get("/api/greeting", (req, res) => {
  const name = req.query.name || "Anonymous";
  res.send(`Hello, ${name}!`);
});

app.get("/*", (req, res) => {
  res.render("404");
});

db.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on port: " + HTTP_PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = app;
