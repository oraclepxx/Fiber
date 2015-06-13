/**
 * Created by xinpan on 05/20/2015.
 */

'use strict'

var crypto = require('crypto');
var express = require('express');
var users = require('../controllers/user_controller.js');

module.exports = function (app) {
    app.use('/static', express.static('../static'));
    app.use('/lib', express.static('../lib'));

    app.get('/', function (req, resp) {
        if (req.session.user) {
            resp.render('index', {username: req.session.username, msg: req.session.msg});

        } else {
            req.session.msg = 'Access denied!';
            resp.redirect('/login');
        }
    });

    app.get('/user', function (req, resp) {
        if (req.session.user) {
            resp.render('user', {msg: req.session.msg});
        } else {
            resp.session.msg = 'Access denied!';
            resp.redirect('/login');
        }
    });

    app.get('/signup', function (req, resp) {
        if (req.session.user) {
            resp.redirect('/signup');
        }
        resp.render('signup', {msg: req.session.msg});
    });

    app.get('/login', function (req, resp) {
        if (req.session.user) {
            resp.redirect('/');
        }
        resp.render('login', {msg: req.session.msg});
    });

    app.get('/logout', function (req, resp) {
        req.session.destroy(function () {
            resp.redirect('/login');
        });
    });

    app.get('/error', function (req, resp) {
        //req.session.destroy(function () {
            resp.render('error');
        //});
    });

    app.post('/login', users.login);
    app.post('/signup', users.signup);
    app.post('/user/update', users.updateUser);
    app.post('/user/delete', users.deleteUser);
    app.get('/user/profile', users.getUser);
    app.get('/error', users.errorHandler);

};