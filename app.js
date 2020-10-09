require("dotenv/config");
var createError = require('http-errors');
var express = require('express');
var bodyParser  =     require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var patients = require('./routes/patient');
var mongoose=require('mongoose');
var passport =require('passport');
var LocalStrategy   =     require("passport-local")
var User= require('./models/users');
var app = express();
var PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use( express.static( "public" ) );
mongoose.connect("mongodb://Aadish09:QWERTY1234@ds123971.mlab.com:23971/tbc",{ useNewUrlParser: true});
app.use(require("express-session")({
    secret:"This is Aadish's",
    resave:false,
    saveUninitialized:false

}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable('etag');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/patient',patients);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(req,res,next){
  res.locals.currentUser=req.user;
  // res.locals.message=req.flash("error");
  next();
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

app.listen(PORT,()=>{console.log("Server connected")})

module.exports = app;
