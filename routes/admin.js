var express = require('express');
var router = express.Router();
const db=require('../config/connection')



/* GET users listing. */
router.get('/', function(req, res, next) {

  res.render('dashboard',{admin:true});
});

module.exports = router;
