/**
 * Created by xinpan on 05/20/2015.
 */
'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, unique: true},
    password: String,
    email: String
});

mongoose.model('User', userSchema);
