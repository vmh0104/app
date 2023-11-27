var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: __dirname });

router.get('/upload', function(req, res, next) {
      res.render('upload', { title: 'Choose File' });
      console.log('Handling GET /upload');    
  });

router.post('/upload',upload.single('filename'), function(req, res, next) {
    console.log('Handling POST /upload');
    console.log(req.file.originalname);
    res.end(req.file.originalname)
});

module.exports = router;