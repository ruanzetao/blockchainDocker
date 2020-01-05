var fs = require("fs");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const User = require("../models/UserModels");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./config/passport")(passport);
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
var jwt = require("jsonwebtoken");
var config = require("./config/main");
const randtoken = require("rand-token");
const app = express();
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = "thisisanexamplesecret";

const PORT = process.env.PORT || 3000;
const db = mongoose.connection;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
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

async function Authentication(req, res, onSuccess) {
  await User.findOne({ email: req.body.email }, async (err, user) => {
    if (err) {
      
      onSuccess({ success: false, error: err });
      return;
    }
    if (!user) {
      
      onSuccess({
        success: false,
        error: "Authentication failed. User not found 1."
      });
      return;
    } else {
      
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result === true) {
         
          res.cookie("access_token", result.token, {
            expires: new Date(Date.now() + 3600000)
          });
          var payload = { email: user.email };
          var token = jwt.sign(payload, jwtOptions.secretOrKey);
          console.log("token"+token);
          onSuccess({ success: true, token: token });
          return;
        } else {
         
          onSuccess({
            success: false,
            error: "Authentication failed. User not found 2."
          });
          return;
        }
      });
    }
  });
}

module.exports = {
  Authentication
};
