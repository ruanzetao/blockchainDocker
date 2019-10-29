const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const User=require('./models/UserModels');
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

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

const app=express();

const PORT = process.env.PORT || 3000;
const db = mongoose.connection;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));



dotenv.config();
//AJX6fEsNmctZkIyH

//connect to db
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("Success."));
db.on('error',(err)=>{
    console.log("Error: "+ err.message);

});

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// function thêm mới 1 user
const createUser = async({email, password,card_name,role}) => {
    return await User.create({ email, password,card_name,role });
};

// function lấy ra danh sách users
const Users = async() => {
    return await User.find();
};

// function lấy ra 1 users
const getUser = async obj => {
    return await User.findOne({
        where: obj,
    });
};



app.get('/', function(req, res){
    Users().then(user => res.json(user))
});


app.post('/register', function(req, res, next){
    var {email, password,card_name,role} = req.body;

    User.findOne({email:req.body.email},(err,user)=>{
        if(user==null){
            bcrypt.hash(password,10,function(err,hash){
                if(err){
                    return next(err);}
                password=hash;
                createUser({email, password,card_name,role}).then(user=>
                    res.json({user, msg: 'account created successfully'}));
            })
        }else{
            res.json({err:'Email has been used'});
        }
    });
});
app.listen(PORT, function(){
    console.log('Express is running on port 3000');
});

//create our strategy for web token
var strategy =new JwtStrategy(jwtOptions,function(jwt_payload,next){
    console.log('payload received',jwt_payload);
    var user=getUser({id:jwt_payload.id});

    if(user){
        next(null,user);
    }else{
        next(null,false);
    }  
});

//use the strategy
passport.use(strategy);
app.use(passport.initialize());

//route login

app.post('/login',async function(req,res,next){
    var {email,password}=req.body;

    if(email&&password){
        // we get the user with the name and save the resolved promise returned
        var user=await User.findOne({email:req.body.email})

        if(!user){
            res.status(401).json({msg:'No such user found', user});
        }

        hash=bcrypt.hash(''+password,10);

        if(bcrypt.compare(hash,user.password)){
            // from now on we’ll identify the user by the id and the id is
            // the only personalized value that goes into our token

            var payload={id:user.id};
            var token=jwt.sign(payload,jwtOptions.secretOrKey);
            res.json({msg: 'ok', token: token});
        }else{
            res.status(401).json({ msg: 'Password is incorrect' });
        }
    }
});

module.exports = app;