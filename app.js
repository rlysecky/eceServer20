const express = require('express');
const bodyParser = require('body-parser');     // Parses JSON in body
const cookieParser = require('cookie-parser'); // Parses cookies
const logger = require('morgan');              // Logs requests & responses
const createError = require('http-errors');    // Reporting server errors to client
const path = require('path'); 

let app = express();

// Routes for Holz app
let usersRouter = require('./routes/users');
let devicesRouter = require('./routes/devices');
let potholesRouter = require('./routes/potholes');

// Routes for other example endpoints and labs
let labRouter = require('./routes/lab');
let participationRouter = require('./routes/participation');
let currencyRouter = require('./routes/currency');
let shippingRouter = require('./routes/shipping');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// This is to enable cross-origin access
app.use(function (req, res, next) {
   // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', '*');
   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', true);
   // Pass to next layer of middleware
   next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static file hosting
app.use(express.static(path.join(__dirname, 'public')));

// Endpoints for Holz App
app.use('/users', usersRouter);
app.use('/devices', devicesRouter);
app.use('/potholes', potholesRouter);

// Endpoints for other examples and labs
app.use('/lab', labRouter);
app.use('/participation', participationRouter);
app.use('/shipping', shippingRouter);
app.use('/currency', currencyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler to return error as JSON data. 
app.use(function(err, req, res, next) {
  if( !err.status ) {
    console.log(req.method + " " + req.originalUrl + " " + 500);
    console.log("Error: " + err.message);
    console.log("Stack: " + err.stack);
  }

  res.status(err.status || 500);  
  res.send(JSON.stringify({
    message: err.message,
    status: err.status,
    stack: err.stack
  }));
});

module.exports = app;
