var express = require('express');
var router = express.Router();

router.get('/upload', function(req, res, next) {
      res.render('upload', { title: 'Choose File' });
      console.log('Handling GET /upload');    
  });

router.post('/upload', function(req, res, next) {
    console.log('Handling POST /upload');
    console.log(req.query.fileName);
   
});
module.exports = router;