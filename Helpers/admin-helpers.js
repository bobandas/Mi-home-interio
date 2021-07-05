var db = require("../config/connection");
var collection = require("../config/collection");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const invNum = require("invoice-number");

const ObjectId = require("mongodb").ObjectId;
const { resolve, reject } = require("promise");

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
        .findOne({ _id: ObjectId(empId) });
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
      res.status = 401;
      res.redirect("/");
    }
  },
  addProduct: (productData) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .insertOne(productData)
        .then(() => {
          resolve();
        });
    });
  },
  findAllProduct: () => {
    return new Promise(async (resolve, reject) => {
      let allProductData = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      if (allProductData == null) {
        reject("NO Product found");
      } else {
        resolve(allProductData);
      }
    });
  },

  findProduct: (Code) => {
    return new Promise(async (resolve, reject) => {
      let data = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .findOne({ itemCode: Code });
      if (data == null) {
        reject("Product Not found");
      } else {
        resolve(data);
      }
    });
  },
  serchProduct: (hint) => {
    return new Promise(async (resolve, reject) => {
      let productData = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ itemCode: { $regex: "^" + hint } })
        .toArray();

      if (productData) {
        resolve(productData);
      } else {
        reject("no product found");
      }
    }).catch(err);
  },
  updateProduct: (productId, updatedData) => {
    console.log(" calling update product", productId, updatedData);
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .replaceOne({ _id: productId }, updatedData);
      resolve();
    });
  },
  deleteProduct: (proid) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .remove({ _id: proid }, { justone: true });
      resolve();
    });
  },
  genarateQuoteNumber: (previusQuoteNumber) => {
    return new Promise(async (resolve, reject) => {
      let quoteNumber='Q0000'
      if(previusQuoteNumber){
        quoteNumber=await invNum.next(previusQuoteNumber)
      }
     resolve(quoteNumber)
    });
  },
};
