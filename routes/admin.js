var express = require("express");
const { ObjectId } = require("mongodb");
const adminHelpers = require("../Helpers/admin-helpers");

var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("admin/dashboard", { layout: "admin-layout" });
});
router.get('/admin',(req,res)=>{
  res.redirect('/')
})

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
      res.render("admin/edit-profile", {data, layout: "admin-layout" });
    } catch (err) {
      console.log(err);
    }
  });
});

router.get('/add-product',(req,res)=>{
  res.render('admin/add-product',{ layout: "admin-layout" })
})
module.exports = router;
