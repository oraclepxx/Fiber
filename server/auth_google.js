/**
 * Created by xinpan on 06/12/2015.
 */

var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var ejs = require('ejs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session: expressSession});
var mongoose = require('mongoose');
var router = require('./routes');
require('../models/users_model.js');
require('../controllers/user_controller');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
        returnURL: 'http://localhost/auth/google/return',
        realm: 'http://localhost/'
    },
    function (identifier, profile, done) {
        process.nextTick(function () {
            profile.identifier = identifier;
            return done(null, profile);
        });

    }
));

var app = express();
app.engine('.html', ejs.__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser());
app.use(cookieParser());
app.use(expressSession({
    secret: 'SECRET',
    cookie: {maxAge: 60 * 60 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/static'));

app.get('/login', function (req, resp) {
    if (req.isAuthenticated()) {
        resp.redirect('/info');
    } else {
        resp.render('login', {user: req.user});
    }
});

app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/return', passport.authenticate('google', {
    successRedirect: '/info',
    failureRedirect: '/login'
}));

app.get('/logout', function (req, resp) {
    req.logout();
    resp.redirect('/login');
});

app.get('/info', function (req, resp) {
    if (req.isAuthenticated()) {
        resp.render('info', {user: req.user});
    } else {
        resp.redirect('/login');
    }
});

//router(app);
app.listen(8111);
