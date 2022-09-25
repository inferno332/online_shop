var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var app = express();

app.use(cors());

var categoriesRouter = require('./routes/categories');
var customersRouter = require('./routes/customers');
var employeesRouter = require('./routes/employees');
var suppliersRouter = require('./routes/suppliers');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/categories', categoriesRouter);
app.use('/customers', customersRouter);
app.use('/employees', employeesRouter);
app.use('/suppliers', suppliersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

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
    res.render('error');
});

module.exports = app;
