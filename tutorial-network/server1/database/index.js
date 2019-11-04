var fs = require("fs");
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const User=require('../models/UserModels');
const bcrypt=require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
require('./config/passport')(passport);
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
var jwt = require('jsonwebtoken');
var config=require('./config/main');
const randtoken = require('rand-token');

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

async function Authentication(req,res,onSuccess){
    var {email,password}=req.body;
    console.log(req.body);

    await User.findOne({email:req.body.email},async (err,user)=>{
        if(err){
            onSuccess({success:false,error:err});
            return;
        }

        if(!user){
            onSuccess({ success: false, error: "Authentication failed. User not found 1." });
            return;
        }
        else{
           if(password==user.password){
                // from now on we’ll identify the user by the id and the id is
                // the only personalized value that goes into our token
                var payload={email:user.email};
                var token=jwt.sign(payload,jwtOptions.secretOrKey);
                //res.json({msg: 'ok', token: token});
                onSuccess({ success: true, token: token});
                return;
           }else{
                //res.status(401).json({ msg: 'Password is incorrect' });
                onSuccess({ success: false, error: "Authentication failed. User not found 2." });
                return;
            }
        }
    });
}

module.exports={
    Authentication
};