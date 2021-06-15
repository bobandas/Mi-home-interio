var db = require("../config/connection");
var collection = require("../config/collection");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const ObjectId = require("mongodb").ObjectId;

module.exports = {
  addEmployee: async (emp, callback) => {
    emp.employee_password = await bcrypt.hash(emp.employee_password, 10);

    db.get()
      .collection(collection.EMPLOYEE_COLLECTION)
      .insertOne(emp)
      .then((data) => {
        callback(data.ops[0]);
      });
  },
  employeeLogin: (data) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let employee = await db
        .get()
        .collection(collection.EMPLOYEE_COLLECTION)
        .findOne({ employeeemail: data.body.username });
      if (employee) {
        bcrypt
          .compare(data.body.password, employee.employee_password)
          .then((status) => {
            if (status) {
              loginStatus = true;
              response.employee = employee;
              response.status = true;
              resolve(response, loginStatus);
            } else {
              console.log("password failed");
              resolve({ loginStatus });
            }
          });
      } else {
        console.log("user not found");
        resolve({ loginStatus });
      }
    });
  },
  validateLogin: (req, res, next) => {
    if (req.session.employee) {
      next();
    } else {
      res.redirect("/");
    }
  },
};
