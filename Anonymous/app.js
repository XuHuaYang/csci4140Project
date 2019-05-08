var createError = require('http-errors');
var express = require('express');
var session = require('express-session');

var secure = require('express-force-https');

var fs = require('fs');
var https = require('https');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var searchRouter = require('./routes/search');
//var uploadRouter = require('./routes/upload');

var app = express();
app.use(secure);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('.html',require('ejs').__express);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 800000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));

app.use('/', indexRouter);
//app.use('/index', indexRouter);
app.use('/users', usersRouter);
// app.use('/search',indexRouter);
// app.use('/upload',indexRouter);



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



module.exports = app;


