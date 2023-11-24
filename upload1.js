const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer();

server.listen(8080, () => {
    console.log('Server running on port 8080');
});

server.on('request', (req, res) => {
    console.log('Received request:', req.url, req.method);

    if (req.url === '/' && req.method === 'GET') {
        console.log('Handling GET /');
        return res.end(fs.readFileSync(__dirname + '/upload.html'));
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

        const filePath = path.join('D:/data', fileName);
        console.log('File path:', filePath);

        const writeStream = fs.createWriteStream(filePath, { flags: 'w' });

        req.on('data', (chunk) => {
            writeStream.write(chunk);
        });

        req.on('end', () => {
            writeStream.end();

            writeStream.on('finish', () => {
                console.log('File write complete.');
                res.end(`File uploaded: ${fileName}`);
            });
        });

        writeStream.on('error', (err) => {
            console.error('Error writing file:', err);
            res.statusCode = 500;
            return res.end('Internal Server Error: Could not write file.');
        });

        return;
    }

    console.log('Not Found');
    res.statusCode = 404;
    res.end('Not Found');
});
