var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/upload', function(req, res, next) {
  res.render('index', { title: 'Upload File' });
  console.log("User Router Working");
  console.log('Server running on port 3000');
  

});

router.post('/upload', function(req, res, next){
    console.log('Received request:', req.url, req.method);
  if (req.url === '/' && req.method === 'GET') {
    console.log('Handling GET /');
    return res.end(fs.readFileSync(__dirname + '/index.jade'));
  }
  if (req.url.startsWith('/upload') && req.method === 'POST') {
    console.log('Handling POST /upload');
    const queryString = req.url.split('?')[1];
        const fileName = new URLSearchParams(queryString).get('fileName');

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
        // const filePath = path.join(__dirname + fileName);
        

        // const writeStream = fs.createWriteStream(filePath, { flags: 'w' });

        // req.on('data', (chunk) => {
        //     writeStream.write(chunk);
        // });

        // req.on('end', () => {
        //     writeStream.end();

        //     writeStream.on('finish', () => {
        //         console.log('File write complete.');
        //         res.end(`File uploaded: ${fileName}`);
        //     });
        // });

        // writeStream.on('error', (err) => {
        //     console.error('Error writing file:', err);
        //     res.statusCode = 500;
        //     return res.end('Internal Server Error: Could not write file.');
        // });

        return;
  }
})



module.exports = router;
