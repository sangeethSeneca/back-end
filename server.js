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

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
var app = express();

const collegeDataModule = require("./modules/collegeData");
const productsDataModule = require("./modules/products");
const ordersDataModule = require("./modules/orders");
const categoriesDataModule = require("./modules/categories");
const usersDataModule = require("./modules/users");

const db = require("./database/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
// setup http server to listen on HTTP_PORT
app.use(express.static("public"));
app.use("/images", express.static(__dirname + "/images"));
app.use(bodyParser.json());

// Parse URL-encoded bodies for x-www-form-urlencoded content type
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.urlencoded({ extended: true }));
app.use(cors());
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

app.get("/students", (req, res) => {
  let course = req.query.course;
  if (course) {
    collegeDataModule
      .getStudentsByCourse(Number(course))
      .then((data) => {
        res.render("students", { students: data });
      })
      .catch((error) => {
        res.render("students", { message: "no results" });
      });
  } else {
    collegeDataModule
      .getAllStudents()
      .then((data) => {
        if (data.length) {
          res.render("students", { students: data });
        } else {
          res.render("students", { message: "No results" });
        }
      })
      .catch((error) => {
        res.render("students", { message: "no results" });
      });
  }
});

app.get("/courses", (req, res) => {
  collegeDataModule
    .getAllCourses()
    .then((data) => {
      if (data.length) {
        res.render("courses", { courses: data });
      } else {
        res.render("courses", { message: "no results" });
      }
    })
    .catch((error) => {
      res.render("courses", { message: "no results" });
    });
});

app.get("/student/:studentNum", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  collegeDataModule
    .getStudentByNum(req.params.studentNum)
    .then((data) => {
      if (data) {
        viewData.student = data; //store student data in the "viewData" object as "student"
      } else {
        viewData.student = null; // set student to null if none were returned
      }
    })
    .catch(() => {
      viewData.student = null; // set student to null if there was an error
    })
    .then(() => collegeDataModule.getAllCourses())
    .then((data) => {
      viewData.courses = data; // store course data in the "viewData" object as "courses"
      // loop through viewData.courses and once we have found the courseId that matches
      // the student's "course" value, add a "selected" property to the matching
      // viewData.courses object
      for (let i = 0; i < viewData.courses.length; i++) {
        if (viewData.courses[i].courseId == viewData.student.course) {
          viewData.courses[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.courses = []; // set courses to empty if there was an error
    })
    .then(() => {
      if (viewData.student == null) {
        // if no student - return an error
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData }); // render the "student" view
      }
    });
});

app.get("/", (req, res) => {
  res.send("EVistra backend");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/htmldemo", (req, res) => {
  res.render("htmlDemo");
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
        res.send({ message: "no results" });
      });
  } else {
    productsDataModule
      .getAllProducts()
      .then((data) => {
        if (data.length > 0) {
          res.send({ products: data });
        }
      })
      .catch((error) => {
        res.send({ message: "no results" });
      });
  }
});

app.post("/products/add", (req, res) => {
  productsDataModule
    .addProduct(req.body)
    .then(() => res.send({ message: "Successfully Added" }))
    .catch((error) => {
      res.send({ error: "Something went wrong" });
    });
});

app.put("/products/edit", (req, res) => {
  productsDataModule
    .editProduct(req.body)
    .then(() => res.send({ message: "Successfully Edited" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.delete("/products/delete", (req, res) => {
  productsDataModule
    .deleteProduct(req.body)
    .then(() => res.send({ message: "Successfully Deleted" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.get("/orders", async (req, res) => {
  ordersDataModule
    .getAllOrders()
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
    .addOrder(req.body)
    .then(() => res.send({ message: "Successfully Added" }))
    .catch((error) => {
      res.send({ error: "Something went wrong" });
    });
});

app.put("/orders/edit", (req, res) => {
  ordersDataModule
    .editOrder(req.body)
    .then(() => res.send({ message: "Successfully Edited" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.delete("/orders/delete", (req, res) => {
  ordersDataModule
    .deleteOrder(req.body)
    .then(() => res.send({ message: "Successfully Deleted" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.get("/users", async (req, res) => {
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
      .getAllUsers()
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

app.post("/users/add", (req, res) => {
  usersDataModule
    .addUser(req.body)
    .then(() => res.send({ message: "Successfully Added" }))
    .catch((error) => {
      res.send({ error: "Something went wrong" });
    });
});

app.put("/users/edit", (req, res) => {
  usersDataModule
    .editUser(req.body)
    .then(() => res.send({ message: "Successfully Edited" }))
    .catch((error) => {
      res.send({ error: error });
    });
});

app.delete("/users/delete", (req, res) => {
  usersDataModule
    .deleteUser(req.body)
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
      res.send({ error: "Something went wrong" });
    });
});

app.put("/categories/edit", (req, res) => {
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
