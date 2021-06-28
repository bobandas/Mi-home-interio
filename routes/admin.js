var express = require("express");
const { ObjectId, Db } = require("mongodb");
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
  });
});
router.get("/delete-product/:id", (req, res) => {
  var proid = ObjectId(req.params.id);
  adminHelpers.deleteProduct(proid).then(() => {
    res.redirect("/admin/product-management");
  });
});
router.get("/create-quote", (req, res) => {
  res.render("admin/create-quote", {
    layout: "admin-layout",
  });
});

//fetch product using ajax XMLHttp Request
router.post("/fetchproduct",(req,res)=>{
  console.log(req.body);
  adminHelpers.findProduct(req.body.proId).then((data)=>{
    console.log(data);
    res.json(data)
  })

})
module.exports = router;
