/**
 * Created by xinpan on 05/21/2015.
 */

'use strict'

var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');

function hashPW(password) {
    return crypto.createHash('sha256').update(password).digest('base64').toString();
}

function signup(req, resp) {
    var user = new User({username: req.body.username});
    user.set('password', hashPW(req.body.password));
    user.set('email', req.body.email);
    user.save(function (err) {
        if (err) {
            resp.session.error = err;
            resp.redirect('/signup');
        } else {
            req.session.user = user.id;
            req.session.username = user.username;
            req.session.msg = 'Authenticated as ' + user.username;
            resp.redirect('/');
        }
    });
}

function login(req, resp) {
    User.findOne({username: req.body.username}).exec(function (err, user) {
        if (!user) {
            err = 'User not found';
        } else if (user.password === hashPW(req.body.password.toString())) {
            req.session.regenerate(function () {
                req.session.user = user.id;
                req.session.username = user.username;
                req.session.password = user.password;
                req.session.msg = 'Authenticated as ' + user.username;
                resp.redirect('/');
            });
        } else {
            err = 'Authenticated failed';
        }
        if (err) {
            req.session.regenerate(function () {
                req.session.msg = err;
                resp.redirect('/');
            });
        }

    });

}

function updateUser(req, resp) {
    User.findOne({_id: req.session.user}).exec(function (err, user) {
        user.set('email', req.body.email);
        user.save(function () {
            if (err) {
                resp.session.error = err;
            } else {
                resp.session.msg = 'Updated';
            }
            resp.redirect('/user');
        });
    });
}

function getUser(req, resp) {
    User.findOne({_id: req.session.user}).exec(function (err, user) {
        if (!user) {
            resp.json(404, {err: 'User not found'});
        } else {
            resp.json(user);
            console.log(resp.json(user));
        }
    });
}

function deleteUser(req, resp) {
    User.findOne({_id: req.session.user}).exec(function (err, user) {
        if (user) {
            user.remove(function (err) {
                if (err) {
                    req.session.msg = err;
                }
                req.session.destroy(function () {
                    resp.redirect('/login');
                });
            });
        } else {
            req.session.msg = 'User not found';
            req.session.destroy(function () {
                resp.redirect('/login');
            });
        }
    });
}

exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUser = getUser;