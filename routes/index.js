const { response } = require("express");
var express = require("express");
var router = express.Router();
const adminHelpers = require("../Helpers/admin-helpers");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.post("/login", (req, res) => {
  adminHelpers.employeeLogin(req).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.employee = response.employee
      res.redirect("/admin");
    } else {
      res.redirect("/");
    }
  });
});
module.exports = router;
