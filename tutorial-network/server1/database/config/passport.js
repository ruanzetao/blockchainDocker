const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const User = require("../../models/UserModels");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
var jwt = require("jsonwebtoken");
var config = require("./main");

jwtOptions.secretOrKey = "thisisanexamplesecret";
var atob = require("atob");

const PORT = process.env.PORT || 3000;
const db = mongoose.connection;

passport.initialize();
passport.session();

dotenv.config();

//connect to db
mongoose.set("useCreateIndex", true);
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Success."));
db.on("error", err => {
  console.log("Error: " + err.message);
});

var cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) token = req.cookies.access_token;
  return token;
};

//Setup work and export for the JWT passport strategy

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = cookieExtractor; // check token in cookie
  opts.secretOrKey = "thisisanexamplesecret";
  passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
      let expirationDate = new Date(jwt_payload.exp * 1000);
      if (expirationDate < new Date()) {
        return done(null, false);
      }
      
      User.findOne({ email: jwt_payload.email }, (err, user) => {
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function(email, done) {
    User.findOne({ email: email }, (err, user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  });
};
