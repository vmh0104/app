var express = require('express');
var router = express.Router();

router.get('/upload', function(req, res, next) {
      res.render('upload', { title: 'Choose File' });    
  });

router.post('/upload', function(req, res, next) {
    console.log('Handling POST /upload');

    
    const fileName = req.query.fileName;

    if (!fileName) {
        console.error('Bad Request: Missing file name.');
        res.statusCode = 400;
        return res.end('Bad Request: Missing file name.');
    }

    if (!fileName.toLowerCase().endsWith('.csv')) {
        console.error('Bad Request: File is not a CSV.');
        res.statusCode = 400;
        return res.end('Bad Request: File is not a CSV.');
    }
    console.log(fileName);
});
module.exports = router;