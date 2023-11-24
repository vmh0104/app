var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.on('request', (req, res) => {
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

      const filePath = path.join('E:/App', fileName);
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

module.exports = app;



