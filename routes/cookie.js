var express = require('express');
var router = express.Router();

router.get('/cookie', function(req, res, next) {
    res.send(req.cookies);
});


module.exports = router;