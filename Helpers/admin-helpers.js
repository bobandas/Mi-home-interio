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





  findEmployee: (empId) => {
    console.log(empId);
    
    
    return new Promise(async (resolve, reject) => {
     let data = await db
        .get()
        .collection(collection.EMPLOYEE_COLLECTION)
        .findOne({ _id: ObjectId(empId)  });
      if (data == null) {
        reject("Internor Error-No employee Found In DB");
      } else {
       
       
        resolve(data);
      }
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
              response.employee = employee._id;
              response.status = true;
              resolve(response, loginStatus);
            } else {
              console.log("password failed");
              reject({ loginStatus });
            }
          });
      } else {
        console.log("user not found");
        reject({ loginStatus });
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
