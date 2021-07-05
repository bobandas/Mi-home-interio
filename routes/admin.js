const { response } = require("express");
var express = require("express");
const { ObjectId, Db } = require("mongodb");
const { resolve } = require("promise");
const { route } = require(".");
const adminHelpers = require("../Helpers/admin-helpers");

var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("admin/dashboard", { layout: "admin-layout" });
});

router.get("/addemployee", (req, res, next) => {
  res.render("admin/add-employee", { layout: "admin-layout" });
});

router.post("/addemployee", (req, res, next) => {
  adminHelpers.addEmployee(req.body).then(() => {
    res.render("admin/add-employee", { layout: "admin-layout" });
  });
});

router.get("/profile", (req, res) => {
  res.render("admin/employee-profile", { layout: "admin-layout" });
});

router.get("/profile/edit-profile", (req, res) => {
  adminHelpers.findEmployee(ObjectId(req.session.employee)).then((data) => {
    try {
      console.log(data);
      res.render("admin/edit-profile", { data, layout: "admin-layout" });
    } catch (err) {
      console.log(err);
    }
  });
});
router.post("/profile/edit-profile", (req, res) => {
  console.log(req.body);
});

router.get("/product-management", (req, res) => {
  adminHelpers.findAllProduct().then((productData) => {
    res.render("admin/product-management", {
      productData,
      layout: "admin-layout",
    });
  });
});

router.post("/add-product", (req, res) => {
  console.log(req.body);
  if (
    req.body.itemCode != "" ||
    req.body.productDescription != "" ||
    req.body.productRate != ""
  ) {
    const date = new Date();
    req.body.creator = req.session.employee;
    req.body.dateOfAdding = date;
    adminHelpers.addProduct(req.body).then(() => {
      res.redirect("/admin/product-management");
    });
  } else {
    console.log(
      " ------------------------------ Enter Product Deatils correctly----------------------"
    );
  }
});

router.get("/edit-product/:id", (req, res) => {
  var id = ObjectId(req.params.id);
  adminHelpers.findProduct(id).then((editedData) => {
    adminHelpers.findAllProduct().then((productData) => {
      res.render("admin/edit-product", {
        productData,
        editedData,
        layout: "admin-layout",
      });
    });
  });
});
router.post("/edit-product/:id", (req, res) => {
  var id = ObjectId(req.params.id);
  adminHelpers.updateProduct(id, req.body).then(() => {
    res.redirect("/admin/product-management");
  }).catch((err)=>{
    console.log(err);
  });
});
router.get("/delete-product/:id", (req, res) => {
  var proid = ObjectId(req.params.id);
  adminHelpers.deleteProduct(proid).then(() => {
    res.redirect("/admin/product-management");
  });
});
router.get("/create-quote", (req, res) => {
  adminHelpers.genarateQuoteNumber().then((quoteNumber) => {
    res.render("admin/create-quote", { quoteNumber,
      layout: "admin-layout",
    });
  });
});

//fetch product using ajax fetch  Request
router.post("/fetchproduct/:code", (req, res) => {
  return new Promise((resolve, reject) => {
    adminHelpers
      .findProduct(req.params.code)
      .then((data) => {
        resolve(res.json({ data }));
      })
      .catch((err) => {
        reject(err);
      });
  }).catch((err) => res.json(err));
});
router.post("/serchproduct/:hint", (req, res) => {
  return new Promise((resolve, reject) => {
    adminHelpers
      .serchProduct(req.params.hint.toUpperCase())
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
});
module.exports = router;
