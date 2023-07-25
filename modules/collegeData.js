const Sequelize = require("sequelize");

var sequelize = new Sequelize(
  "klnksjno",
  "klnksjno",
  "W96p_9jIklCE5HY0mBB9Vi7V1GR676YR",
  {
    host: "salt.db.elephantsql.com1",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);
var student = sequelize.define("student", {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING,
});

var course = sequelize.define("course", {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING,
});

course.hasMany(student, { foreignKey: "course" });

module.exports.initialize = () => {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync({ force: true })
      .then(() => resolve("Success"))
      .catch((error) => reject("unable to sync the database"));
  });
};

module.exports.getAllStudents = () => {
  return new Promise(async (resolve, reject) => {
    student
      .findAll()
      .then((data) => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getTAs = () => {
  return new Promise((resolve, reject) => {
    reject("no results returned");
  });
};

module.exports.getAllCourses = () => {
  return new Promise(function (resolve, reject) {
    course
      .findAll()
      .then((data) => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getStudentsByCourse = (course) => {
  return new Promise(function (resolve, reject) {
    student
      .findAll({
        where: {
          course: course,
        },
      })
      .then((data) => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getStudentByNum = (num) => {
  return new Promise(function (resolve, reject) {
    student
      .findAll({
        where: {
          studentNum: num,
        },
      })
      .then((data) => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};

module.exports.addStudent = (studentData) => {
  return new Promise(function (resolve, reject) {
    studentData.TA = studentData.TA ? true : false;
    for (const property in studentData) {
      if (studentData[property] == "") {
        studentData[property] = null;
      }
    }
    student
      .create(studentData)
      .then(() => resolve("success"))
      .catch(() => reject("unable to create student"));
  });
};

module.exports.getCourseById = (id) => {
  return new Promise(function (resolve, reject) {
    course
      .findAll({
        where: {
          courseId: id,
        },
      })
      .then((data) => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};

module.exports.updateStudent = (studentData) => {
  return new Promise(function (resolve, reject) {
    studentData.TA = studentData.TA ? true : false;
    for (const property in studentData) {
      if (studentData[property] == "") {
        studentData[property] = null;
      }
    }
    student
      .update(studentData, {
        where: {
          studentNum: studentData.studentNum,
        },
      })
      .then(() => resolve("success"))
      .catch(() => reject("unable to update student"));
  });
};

module.exports.addCourse = (courseData) => {
  return new Promise(function (resolve, reject) {
    for (const property in courseData) {
      if (courseData[property] == "") {
        courseData[property] = null;
      }
    }
    course
      .create(courseData)
      .then(() => resolve("success"))
      .catch(() => reject("unable to create Course"));
  });
};

module.exports.updateCourse = (courseData) => {
  return new Promise(function (resolve, reject) {
    for (const property in courseData) {
      if (courseData[property] == "") {
        courseData[property] = null;
      }
    }
    course
      .update(courseData, {
        where: {
          courseId: courseData.courseId,
        },
      })
      .then(() => resolve("success"))
      .catch(() => reject("unable to update student"));
  });
};

module.exports.deleteCourseById = (id) => {
  return new Promise(function (resolve, reject) {
    course
      .destroy({
        where: {
          courseId: id,
        },
      })
      .then(() => resolve("Destroyed"))
      .catch(() => reject("was rejected"));
  });
};

module.exports.deleteStudentByNum = (studentNum) => {
  return new Promise(function (resolve, reject) {
    student
      .destroy({
        where: {
          studentNum: studentNum,
        },
      })
      .then(() => resolve("Destroyed"))
      .catch(() => reject("was rejected"));
  });
};
