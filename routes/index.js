var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Upload File' });
  console.log("User Router Working");
  console.log('Server running on port 3000');
  
});
  
module.exports = router;
