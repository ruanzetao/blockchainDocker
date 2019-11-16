const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const User=require('./models/UserModels');
//const bcrypt=require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');

const passport = require('passport');
require('./database/config/passport')(passport);
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
var jwt = require('jsonwebtoken');
const database=require('./database/index');
const blockchain=require('./blockchain/index');

// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'thisisanexamplesecret';

const app=express();

const PORT = process.env.PORT || 3000;
const db = mongoose.connection;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());



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

var opts = {};
opts.jwtFromRequest = cookieExtractor; // check token in cookie
opts.secretOrKey = 'thisisanexamplesecret';
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    let expirationDate = new Date(jwt_payload.exp * 1000);
    if (expirationDate < new Date()) {
        return done(null, false);
    }
    var user= User.getUser({email:jwt_payload.email});

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
    var user= User.getUser({email:email});
    if(user){
        next(null,user);
    }else{
        next(null,false);
    }
});





app.get('/', function(req, res){
    res.render("login");
    //User.getUsers().then(user=>res.json(user));
    //User.getUsers().then(user=>res.json(user));
});

app.get('/register', function(req, res){
    res.render("register");
});


app.post('/register', function(req, res, next){
    console.log(req.body);
    User.findOne({email:req.body.email},(err,user)=>{
        if(user==null){
            const user=new User(req.body);
            user.email=req.body.email;
            user.password=req.body.password;
            user.role=req.body.role;
            user.name=req.body.name;
            user.address=req.body.address;
            user.phone=req.body.phone;
            user.sex=req.body.sex;
            user.identityCardNumber=req.body.identityCardNumber;

            user.save();

            if(user){
                res.redirect("index");
            }else{
                res.redirect("register");
            }
            
        }else{
            //res.json({err:'Email has been used'});
            res.redirect("register");
        }
    });
});


//route login

// app.get("/login", function (req, res, next) {
//     if (req.cookies.access_token) {
//         res.redirect("/home");
//     } else {
//         res.render('login1')
//     }
// });

app.post('/login',async function(req,res,next){

    database.Authentication(req,res,(result)=>{
        if(result.success){
            // res.cookie('access_token',result.token,{expires: new Date(Date.now() + 3600000)});
            // res.json({msg: 'ok',token:result.token});
            res.redirect('/index');
        }else{
            console.log("From post /login - Authentication function:\n" + result.error);
            res.redirect("/login");
        }
    })
    // var {email,password}=req.body;

    // if(email&&password){
    //     // we get the user with the name and save the resolved promise returned
    //     var user=await User.findOne({email:req.body.email})

    //     if(!user){
    //         res.status(401).json({msg:'No such user found', user});
    //     }
    //     console.log("log:"+password);
    //     console.log("log:"+user.password);
    //     if(password==user.password){
    //         // from now on we’ll identify the user by the id and the id is
    //         // the only personalized value that goes into our token
    //         var payload={email:user.email};
    //         var token=jwt.sign(payload,jwtOptions.secretOrKey);
    //         res.json({msg: 'ok', token: token});
    //     }else{
    //         res.status(401).json({ msg: 'Password is incorrect' });
    //     }
    // }
});

app.get('/index', function(req, res){
    var idCardNumber = req.body.identityCardNumber;
    var result = await blockchain.createDoctor(req.body);
    await blockchain.createDoctorIdentity(idCardNumber);
    var cardName = idCardNumber + "@tutorial-network";
    await blockchain.ping(cardName);
    const cardData=await blockchain.exportCard(cardName);
    await blockchain.deleteCard(cardName);
    await blockchain.importCard(cardName,cardData);
    console.log(result);
    console.log("Done add doctor!");
    res.render("index");
    //User.getUsers().then(user=>res.json(user));
    //User.getUsers().then(user=>res.json(user));
});

app.post('/adddoctor',async function(req,res){
    // if ("admin@tutorial-network" !== req.user.cardName) {
    //     res.redirect("/register");
    //     return;
    // }

    var idCardNumber = req.body.identityCardNumber;
    var result = await blockchain.createDoctor(req.body);
    await blockchain.createDoctorIdentity(idCardNumber);
    var cardName = idCardNumber + "@tutorial-network";
    await blockchain.ping(cardName);
    const cardData=await blockchain.exportCard(cardName);
    await blockchain.deleteCard(cardName);
    await blockchain.importCard(cardName,cardData);
    console.log(result);
    console.log("Done add doctor!");
})

app.listen(PORT, function(){
    console.log('Express is running on port 3000');
});

module.exports = app;