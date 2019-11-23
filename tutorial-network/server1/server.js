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
var jwtPayloadDecoder = require('jwt-payload-decoder');
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'thisisanexamplesecret';
var atob = require('atob');
const app=express();

const PORT = process.env.PORT || 3000;
const db = mongoose.connection;

app.set("view engine", "ejs");
app.set("views",__dirname +"/views");
app.use(express.static("public"));
app.use('/profile', express.static(__dirname + '/public'));

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


app.post('/register', async function(req, res, next){
    console.log(req.body);
    //var count =User.find().count();
    User.findOne({email:req.body.email},async (err,user)=>{
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

            var done=0;

            if(req.body.role=="Doctor"){
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
                done=1;
            }
            if(req.body.role=="Patient"){
                var idCardNumber = req.body.identityCardNumber;
                var result = await blockchain.createPatient(req.body);
                await blockchain.createPatientIdentity(idCardNumber);
                var cardName = idCardNumber + "@tutorial-network";
                await blockchain.ping(cardName);
                const cardData=await blockchain.exportCard(cardName);
                await blockchain.deleteCard(cardName);
                await blockchain.importCard(cardName,cardData);
                console.log(result);
                console.log("Done add patient!");
                done=1;
            }          

            if(done==1){
                //res.redirect("index");
                var idCardNumber = req.body.identityCardNumber;
                if(req.body.role=="Doctor"){
                    var getuser=await blockchain.getDoctor(cardName);
                }

                if(req.body.role=="Patient"){
                    var getuser=await blockchain.getPatient(cardName);
                }
                
                res.render("index",{data:getuser});
                //console.log("data: "+data);
            }else{
                res.redirect("register");
            }
            
        }else{
            //res.json({err:'Email has been used'});
            res.redirect("register");
        }
    });
});

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    console.log("jsonPayload"+jsonPayload);
    var object=JSON.parse(jsonPayload);
    console.log("object: "+ object)
    var email=object.email;
    console.log("email: "+email);

    return email;
};

app.post('/login',async function(req,res,next){
    console.log("login start");
    database.Authentication(req,res,(result)=>{
        if(result.success){
            User.findOne({email:req.body.email}, async (err,user)=>{
                console.log("email: "+req.body.email)
                console.log(user.identityCardNumber);
                res.cookie('access_token', result.token, { expires: new Date(Date.now() + 3600000) });
                console.log("token: "+result.token);
                console.log("email: "+parseJwt(result.token));
                res.render('index',{data: user});
            });
            
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

app.get('/index',passport.authenticate('jwt',{failureRedirect:"/login"}), function(req, res){
    res.render("index",{data: user});
    console.log("Index: "+user);
    //User.getUsers().then(user=>res.json(user));
    //User.getUsers().then(user=>res.json(user));
});

app.get('/demoprofile',function(req,res){
    res.render("profile");
})

app.get('/profile/:identityCardNumber',passport.authenticate('jwt',{failureRedirect:"/login"}),async function(req, res){ 
    
        var identityCardNumber=req.params.identityCardNumber;
        var cardName = identityCardNumber + "@tutorial-network";
        

        User.findOne({identityCardNumber:req.params.identityCardNumber},async (err,user)=>{
            if(user){
                if(user.role=='Doctor'){
                    var doctor=await blockchain.getDoctorInfo(cardName);
                    if(doctor==1){
                        var doctor = {
                            name: 'Name',
                            address: 'Address',
                            email: 'Email',
                            phone: 'Phone',
                            identityCardNumber: 'Identity Card Number',
                            sex: 'Male/Female/Other',
                            specialist: 'Specialist',
                            marriageStatus: 'Marriage Status',
                            tittle: 'Tittle'
                        };
                    }
                    res.render("profile",{data: doctor});
                }

                if(user.role=='Patient'){
                    var patient=await blockchain.getPatientInfo(cardName);
                    if(patient==1){
                        var patient = {
                            name: 'Name',
                            address: 'Address',
                            email: 'Email',
                            phone: 'Phone',
                            identityCardNumber: 'Identity Card Number',
                            sex: 'Male/Female/Other',
                            career: 'Career',
                            marriageStatus: 'Marriage Status'
                        };
                    }
                    res.render("patientprofile",{data: patient});
                }
            }else{
                console.log("error in /profile/:identityCardNumber:"+err);
            }
        });

});

app.post('/profile/:identityCardNumber',passport.authenticate('jwt',{failureRedirect:"/login"}),async function(req, res){ 
    User.findOne({identityCardNumber:req.params.identityCardNumber},async (err,user)=>{
        if(user){
            if(user.role=='Doctor'){
                await blockchain.createDoctorInfo(req.body);
                console.log("Done create doctor info");
            }  
            if(user.role=='Patient'){
                await blockchain.createPatientInfo(req.body);
                console.log("Done create patient info");
            }
        }else{
            console.log("User not found!"+err);
        }
    });
});

app.get('/request/:identityCardNumber',passport.authenticate('jwt',{failureRedirect:"/login"}),async function(req, res){ 
    
    var identityCardNumber=req.params.identityCardNumber;
    var cardName = identityCardNumber + "@tutorial-network";
    

    User.findOne({identityCardNumber:req.params.identityCardNumber},async (err,user)=>{
        if(user){
                //var doctor=await blockchain.getDoctorInfo(cardName);
                res.render("request");
            
        }else{
            console.log("error in /request/:identityCardNumber:"+err);
        }
    });

});

app.get('/doctors', async function(req, res){
    var cardName='admin@tutorial-network';
    var result=await blockchain.getDoctor(cardName);
    res.json({msg:'ok',result:result});
});

app.get('/patients', async function(req, res){
    var cardName='admin@tutorial-network';
    var result=await blockchain.getPatient(cardName);
    res.json({msg:'ok',result:result});
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

app.get('/countdoctorinfo', async function(req,res){
    var cardName='admin@tutorial-network'
    var results=await blockchain.countDoctorInfo(cardName);
    console.log("count: "+results);
})

app.post('/adddoctorinfo', async function(req,res){
    await blockchain.createDoctorInfo(req.body);
    console.log("Done create doctor info");
});

app.post('/addpatientinfo', async function(req,res){
    await blockchain.createPatientInfo(req.body);
    console.log("Done create doctor info");
});

app.listen(PORT, function(){
    console.log('Express is running on port 3000');
});

module.exports = {app,parseJwt};