var express = require("express");
const { ObjectId } = require("mongodb");
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
router.post('/profile/edit-profile', (req, res) => {
  console.log(req.body);
})






router.get('/product-management', (req, res) => {

  adminHelpers.findAllProduct().then((productData) => {
    

 
    res.render('admin/product-management', { productData, layout: "admin-layout" })
  })

})




router.post("/add-product", (req, res) => {
  console.log(req.body);
  if (req.body.itemCode != "" || req.body.productDescription != "" || req.body.productRate != "") {

    const date = new Date()
    req.body.creator = req.session.employee
    req.body.dateOfAdding = date
    adminHelpers.addProduct(req.body).then(() => {
      res.redirect('/admin/product-management')
    })
  } else {
    console.log(" ------------------------------ Enter Product Deatils correctly----------------------");

  }



})
module.exports = router;
