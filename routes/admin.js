var express = require('express');
const adminHelpers = require('../Helpers/admin-helpers')

var router = express.Router();



/* GET users listing. */
router.get('/', function(req, res, next) {

  res.render('admin/dashboard',{layout:'admin-layout'});
});




router.get('/addemployee',(req, res, next)=> {

  res.render('admin/add-employee',{layout:'admin-layout'});
});




router.post('/addemployee',(req, res, next)=> {
  
 
  adminHelpers.addEmployee(req.body).then(()=>{
    res.render('admin/add-employee',{layout:'admin-layout'});
  })

  
});

router.get("/profile",(req,res)=>{
  res.render('admin/employee-profile',{layout:'admin-layout'})
})

module.exports = router; 
