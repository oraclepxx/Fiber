/**
 * Created by xinpan on 05/20/2015.
 */

'use strict'

var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session: expressSession});
var mongoose = require('mongoose');

require('../models/users_model.js');
var router = require('./routes.js');

var conn = mongoose.connect('mongodb://localhost/fiber');
var app = express();

app.engine('.html', ejs.__express);
app.set('views', __dirname + '/../views');
app.set('view engine', 'html');
app.use(bodyParser());
app.use(cookieParser());
app.use(expressSession({
    secret: 'secret',
    cookie: {maxAge: 60 * 60 * 1000},
    store: new mongoStore({
        mongooseConnection: mongoose.connection,
        collection: 'session'
    })
}));

router(app);
app.listen(8111);

