const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const User=require('../../models/UserModels');
const bcrypt=require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
var jwt = require('jsonwebtoken');
var config=require('./main');

// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'thisisanexamplesecret';

const PORT = process.env.PORT || 3000;
const db = mongoose.connection;


dotenv.config();

//connect to db
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("Success."));
db.on('error',(err)=>{
    console.log("Error: "+ err.message);

});

var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) token = req.cookies.access_token;
    return token;
};

//Setup work and export for the JWT passport strategy

module.exports = function (passport) {
    var opts = {};
    // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");// server sẽ giải mã jwt để lấy các thông tin mà mình đã ký
    opts.jwtFromRequest = cookieExtractor;
    opts.secretOrKey = config.secret;
    // console.log(opts);
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log(jwt_payload);
        let expirationDate = new Date(jwt_payload.exp * 1000);
        if (expirationDate < new Date()) {
            return done(null, false);
        }

        var user=User.getUser({email:jwt_payload.email});

        if(user){
            next(null,user);
        }else{
            next(null,false);
        }

    }));

    passport.serializeUser(function (user, done) {
        done(null, user.email);
    });

    passport.deserializeUser(function (email, done) {
        var user=User.getUser({email:email});

        if(user){
            next(null,user);
        }else{
            next(null,false);
        }

    });

};
