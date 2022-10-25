const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
// JWT Setup
const jwt = require('jsonwebtoken');
const passport = require('passport');

const jwtSettings = require('./constants/jwtSettings');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const categoriesRouter = require('./routes/categories');
const customersRouter = require('./routes/customers');
const employeesRouter = require('./routes/employees');
const suppliersRouter = require('./routes/suppliers');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const uploadRouter = require('./routes/upload');

const authRouter = require('./routes/auth');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use(cors());

// Passport: Bearer Token
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSettings.SECRET;
opts.issuer = jwtSettings.ISSUER;
opts.audience = jwtSettings.AUDIENCE;

passport.use(
  new JwtStrategy(opts, function (payload, done) {
    console.log('\n🚀 JwtStrategy 🚀\n');
    const _id = payload.uid;
    findDocument(_id, 'login')
      .then((result) => {
        if (result) {
          return done(null, result);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        return done(err, false);
      });
  }),
);

// END: PASSPORT

app.use('/categories', categoriesRouter);
app.use('/customers', customersRouter);
app.use('/employees', employeesRouter);
app.use('/suppliers', suppliersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/upload', uploadRouter);

app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
});

module.exports = app;
