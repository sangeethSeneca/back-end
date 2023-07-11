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
const exphbs = require("express-handlebars");
// setup http server to listen on HTTP_PORT
app.use(express.static("public"));
app.use("/images", express.static(__dirname + "/images"));
app.use(express.urlencoded({ extended: true }));

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
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/htmldemo", (req, res) => {
  res.render("htmlDemo");
});

app.get("/students/add", (req, res) => {
  collegeDataModule
    .getAllCourses()
    .then((data) => res.render("addStudent", { courses: data }))
    .catch(() => res.render("addStudent", { courses: [] }));
});

app.get("/courses/add", (req, res) => {
  res.render("addCourse");
});

app.get("/courses/add", (req, res) => {
  res.render("addCourse");
});

app.post("/students/add", (req, res) => {
  collegeDataModule
    .addStudent(req.body)
    .then(() => res.redirect("/students"))
    .catch((error) => {
      res.send({ error: "Something went wrong" });
    });
});

app.post("/courses/add", (req, res) => {
  collegeDataModule
    .addCourse(req.body)
    .then(() => res.redirect("/courses"))
    .catch((error) => {
      res.send({ error: "Something went wrong" });
    });
});

app.get("/course/:id", (req, res) => {
  let courseId = req.params.id;
  collegeDataModule
    .getCourseById(courseId)
    .then((data) => {
      if (data) {
        res.render("course", { course: data });
      } else {
        res.status(404).send("Course Not Found");
      }
    })
    .catch((error) => {
      res.render("courses", { message: "no results" });
    });
});

app.post("/student/update", (req, res) => {
  collegeDataModule
    .updateStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((error) => {
      res.send({ error: "Something went wrong" });
    });
});

app.post("/course/update", (req, res) => {
  collegeDataModule
    .updateCourse(req.body)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((error) => {
      res.send({ error: "Something went wrong" });
    });
});

app.get("/course/delete/:id", (req, res) => {
  let courseId = req.params.id;
  collegeDataModule
    .deleteCourseById(courseId)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((error) => {
      res.status(500).send("Unable to Remove Course / Course not found");
    });
});

app.get("/student/delete/:studentNum", (req, res) => {
  let studentNum = req.params.studentNum;
  collegeDataModule
    .deleteStudentByNum(studentNum)
    .then(() => {
      res.redirect("/students");
    })
    .catch((error) => {
      res.status(500).send("Unable to Remove Student / StudentW not found");
    });
});

app.get("/*", (req, res) => {
  res.render("404");
});

collegeDataModule
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on port: " + HTTP_PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
