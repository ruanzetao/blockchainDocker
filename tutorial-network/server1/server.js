const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const User = require("./models/UserModels");
//const bcrypt=require('bcrypt');
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cookieParser = require("cookie-parser");

const passport = require("passport");
require("./database/config/passport")(passport);
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
var jwt = require("jsonwebtoken");
const database = require("./database/index");
const blockchain = require("./blockchain/index");
var jwtPayloadDecoder = require("jwt-payload-decoder");
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = "thisisanexamplesecret";
var atob = require("atob");
const app = express();

const PORT = process.env.PORT || 3000;
const db = mongoose.connection;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use("/profile", express.static(__dirname + "/public"));
app.use("/request", express.static(__dirname + "/public"));
app.use("/request/accept", express.static(__dirname + "/public"));
app.use("/request/reject", express.static(__dirname + "/public"));
app.use("/healthrecord", express.static(__dirname + "/public"));
app.use("/healthrecord/detail", express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(bodyParser.json());
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

app.get(
  "/",

  async function(req, res) {
    res.render("login");
  }
);

app.get(
  "/login",

  async function(req, res) {
    res.render("login");
  }
);

app.get("/logout", async function(req, res) {
  await req.logout();
  req.session = null;
  return res.redirect("/");
});

app.get(
  "/register",

  async function(req, res) {
    res.render("register");
  }
);
app.post("/register", async function(req, res, next) {
  User.findOne({ email: req.body.email }, async (err, user) => {
    if (user == null) {
      const user = new User(req.body);
      user.email = req.body.email;
      user.password = req.body.password;
      user.role = req.body.role;
      user.name = req.body.name;
      user.address = req.body.address;
      user.phone = req.body.phone;
      user.sex = req.body.sex;
      user.identityCardNumber = req.body.identityCardNumber;
      user.save();

      var done = 0;

      if (req.body.role == "Doctor") {
        var idCardNumber = req.body.identityCardNumber;
        var result = await blockchain.createDoctor(req.body);
        await blockchain.createDoctorIdentity(idCardNumber);
        var cardName = idCardNumber + "@tutorial-network";
        await blockchain.ping(cardName);
        const cardData = await blockchain.exportCard(cardName);
        await blockchain.deleteCard(cardName);
        await blockchain.importCard(cardName, cardData);

        console.log("Done add doctor!");
        done = 1;
      }
      if (req.body.role == "Patient") {
        var idCardNumber = req.body.identityCardNumber;
        var result = await blockchain.createPatient(req.body);
        await blockchain.createPatientIdentity(idCardNumber);
        var cardName = idCardNumber + "@tutorial-network";
        await blockchain.ping(cardName);
        const cardData = await blockchain.exportCard(cardName);
        await blockchain.deleteCard(cardName);
        await blockchain.importCard(cardName, cardData);

        console.log("Done add patient!");
        done = 1;
      }

      if (done == 1) {
        //res.redirect("index");
        var idCardNumber = req.body.identityCardNumber;
        if (req.body.role == "Doctor") {
          var getuser = await blockchain.getDoctor(cardName);
        }

        if (req.body.role == "Patient") {
          var getuser = await blockchain.getPatient(cardName);
        }

        res.render("login");
        //console.log("data: "+data);
      } else {
        res.redirect("register");
      }
    } else {
      res.redirect("register");
    }
  });
});

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  var object = JSON.parse(jsonPayload);

  var email = object.email;

  return email;
}

app.post("/login", async function(req, res, next) {
  console.log("login start");
  database.Authentication(req, res, result => {
    if (result.success) {
      User.findOne({ email: req.body.email }, async (err, user) => {
        res.cookie("access_token", result.token, {
          expires: new Date(Date.now() + 3600000)
        });
        res.render("index");
      });
    } else {
      res.redirect("/login");
    }
  });
});

app.get(
  "/index",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var token = req.cookies.access_token;
    var email = parseJwt(token);
    if (email) {
      User.findOne({ email: email }, async (err, user) => {
        if (user) {
          res.render("index");
        } else {
          res.render("login");
        }
      });
    } else {
      res.render("login");
    }
  }
);

app.get(
  "/profile/",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var token = req.cookies.access_token;
    var email = parseJwt(token);
    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        var identityCardNumber = user.identityCardNumber;
        var cardName = identityCardNumber + "@tutorial-network";
        if (user.role == "Doctor") {
          var doctor = await blockchain.getDoctorInfo(identityCardNumber);
          if (doctor == 1) {
            var doctor = {
              name: "Name",
              address: "Address",
              email: "Email",
              phone: "Phone",
              identityCardNumber: "Identity Card Number",
              sex: "Male/Female/Other",
              specialist: "Specialist",
              marriageStatus: "Marriage Status",
              tittle: "Tittle"
            };
          }
          res.render("profile", { data: doctor });
        }

        if (user.role == "Patient") {
          var patient = await blockchain.getPatientInfo(identityCardNumber);
          if (patient == 1) {
            var patient = {
              name: "Name",
              address: "Address",
              email: "Email",
              phone: "Phone",
              identityCardNumber: "Identity Card Number",
              sex: "Male/Female/Other",
              career: "Career",
              marriageStatus: "Marriage Status"
            };
          }
          res.render("patientprofile", { data: patient });
        }
      } else {
        console.log("error in /profile/" + err);
      }
    });
  }
);

app.post(
  "/profile/",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var token = req.cookies.access_token;

    var email = parseJwt(token);

    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        var identityCardNumber = user.identityCardNumber;
        var cardName = identityCardNumber + "@tutorial-network";
        if (user.role == "Doctor") {
          await blockchain.createDoctorInfo(req.body);
          var doctorinfo = await blockchain.getDoctorInfo(identityCardNumber);
          res.render("profile", { data: doctorinfo });
        }
        if (user.role == "Patient") {
          await blockchain.createPatientInfo(req.body);
          await blockchain.createHealthRecord(req.body.identityCardNumber);

          var patientinfo = await blockchain.getPatientInfo(identityCardNumber);
          res.render("patientprofile", { data: patientinfo });
        }
      } else {
        console.log("User not found!" + err);
      }
    });
  }
);

app.get(
  "/request/",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var token = req.cookies.access_token;

    var email = parseJwt(token);

    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        if (user.role == "Doctor") {
          var identityCardNumber = user.identityCardNumber;
          var cardName = identityCardNumber + "@tutorial-network";

          var request = await blockchain.getRequestByDoctor(
            cardName,
            identityCardNumber
          );
          console.log("request" + request);

          var berequest = await blockchain.getRequestBeRequest(
            cardName,
            identityCardNumber
          );
          console.log("berequest" + berequest);

          var result = { request, berequest };
          res.render("request", { data: result });
        }

        if (user.role == "Patient") {
          var identityCardNumber = user.identityCardNumber;
          var cardName = identityCardNumber + "@tutorial-network";
          var request = await blockchain.getRequestByPatient(
            cardName,
            identityCardNumber
          );
          console.log("request" + request);

          var berequest = await blockchain.getRequestBeRequest(
            cardName,
            identityCardNumber
          );
          console.log("berequest" + berequest);
          var result = { request, berequest };
          res.render("request", { data: result });
        }
      } else {
        res.render("request");
      }
    });
  }
);

app.post(
  "/request/",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var token = req.cookies.access_token;
    var email = parseJwt(token);

    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        var identityCardNumber = user.identityCardNumber;
        var cardName = identityCardNumber + "@tutorial-network";
        if (user.role == "Doctor") {
          await blockchain.createRequest(req.body);

          var request = await blockchain.getRequestByDoctor(
            cardName,
            identityCardNumber
          );
          console.log("request" + request);

          var berequest = await blockchain.getRequestBeRequest(
            cardName,
            identityCardNumber
          );
          console.log("berequest" + berequest);

          var result = { request, berequest };
          res.render("request", { data: result });
        }
        if (user.role == "Patient") {
          await blockchain.createRequest(req.body);

          var request = await blockchain.getRequestByPatient(
            cardName,
            identityCardNumber
          );
          console.log("request" + request);

          var berequest = await blockchain.getRequestBeRequest(
            cardName,
            identityCardNumber
          );
          console.log("berequest" + berequest);
          var result = { request, berequest };
          res.render("request", { data: result });
        }
      } else {
        console.log("User not found!" + err);
        //res.redirect("/request");
      }
    });
  }
);

app.get(
  "/doctors",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    //var cardName = "admin@tutorial-network";
    var result = await blockchain.getDoctorInfos();
    res.render("doctors", { data: result });
  }
);

app.post(
  "/requestdoctorinfo",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var token = req.cookies.access_token;
    var email = parseJwt(token);

    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        var identityCardNumber = user.identityCardNumber;
        var cardName = identityCardNumber + "@tutorial-network";
        if (user.role == "Doctor") {
          var requesterRole = user.role;
          var resourceOwnerRole = req.body.resourceOwnerRole;
          var resourceType = req.body.resourceType;
          var resourceId = req.body.resourceId;
          var idRequester = user.identityCardNumber;
          var idResourceOwner = req.body.resourceOwner;
          var data = {
            requesterRole,
            resourceOwnerRole,
            resourceType,
            resourceId,
            idRequester,
            idResourceOwner
          };

          await blockchain.createRequest(data);
          var request = await blockchain.getRequestByDoctor(
            cardName,
            identityCardNumber
          );

          var berequest = await blockchain.getRequestBeRequest(
            cardName,
            identityCardNumber
          );

          var result = { request, berequest };
          res.render("request", { data: result });
        }

        if (user.role == "Patient") {
          var requesterRole = user.role;
          var resourceOwnerRole = req.body.resourceOwnerRole;
          var resourceType = req.body.resourceType;
          var resourceId = req.body.resourceId;
          var idRequester = user.identityCardNumber;
          var idResourceOwner = req.body.resourceOwner;
          var data = {
            requesterRole,
            resourceOwnerRole,
            resourceType,
            resourceId,
            idRequester,
            idResourceOwner
          };

          await blockchain.createRequest(data);
          var request = await blockchain.getRequestByPatient(
            cardName,
            identityCardNumber
          );

          var berequest = await blockchain.getRequestBeRequest(
            cardName,
            identityCardNumber
          );

          var result = { request, berequest };
          res.render("request", { data: result });
        }
      } else {
        res.render("index");
      }
    });
  }
);

app.post(
  "/requestpatientinfo",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var token = req.cookies.access_token;
    var email = parseJwt(token);
    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        var identityCardNumber = user.identityCardNumber;
        var cardName = identityCardNumber + "@tutorial-network";
        if (user.role == "Doctor") {
          var requesterRole = user.role;
          var resourceOwnerRole = req.body.resourceOwnerRole;
          var resourceType = req.body.resourceType;
          var resourceId = req.body.resourceId;
          var idRequester = user.identityCardNumber;
          var idResourceOwner = req.body.resourceOwner;
          var data = {
            requesterRole,
            resourceOwnerRole,
            resourceType,
            resourceId,
            idRequester,
            idResourceOwner
          };
          await blockchain.createRequest(data);
          var request = await blockchain.getRequestByDoctor(
            cardName,
            identityCardNumber
          );

          var berequest = await blockchain.getRequestBeRequest(
            cardName,
            identityCardNumber
          );

          var result = { request, berequest };
          res.render("request", { data: result });
        }
      } else {
        res.render("index");
      }
    });
  }
);

app.get(
  "/patients",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    //var cardName = "admin@tutorial-network";

    var token = req.cookies.access_token;

    var email = parseJwt(token);

    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        var identityCardNumber = user.identityCardNumber;
        var cardName = identityCardNumber + "@tutorial-network";
        if (user.role == "Doctor") {
          var result = await blockchain.getPatientInfos();
          res.render("patients", { data: result });
        }
        if (user.role == "Patient") {
          res.render("patientserror");
        }
      } else {
        console.log("User not found!");
        //res.redirect("/index");
      }
    });
  }
);

// app.post("/adddoctor", async function(req, res) {
//   var idCardNumber = req.body.identityCardNumber;
//   var result = await blockchain.createDoctor(req.body);
//   await blockchain.createDoctorIdentity(idCardNumber);
//   var cardName = idCardNumber + "@tutorial-network";
//   await blockchain.ping(cardName);
//   const cardData = await blockchain.exportCard(cardName);
//   await blockchain.deleteCard(cardName);
//   await blockchain.importCard(cardName, cardData);
// });

app.post(
  "/request/accept/",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var requestId = req.body.requestId;
    var requesterRole = req.body.requesterRole;  
    var token = req.cookies.access_token;
    var email = parseJwt(token);
    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        if (user.role == "Doctor") {
          var identityCardNumber = user.identityCardNumber;
          var cardName = identityCardNumber + "@tutorial-network";
          if (requesterRole == "Patient") {                      
            await blockchain.doctorAcceptRequestOfPatient(cardName,requestId);
          }
          if (requesterRole == "Doctor") {
            
            await blockchain.doctorAcceptRequestOfDoctor(cardName,requestId);
          }         
          var request = await blockchain.getRequestByDoctor(
            cardName,
            identityCardNumber
          );

          var berequest = await blockchain.getRequestBeRequest(
            cardName,
            identityCardNumber
          );
          var result = { request, berequest };
          res.render("request", { data: result });
        }
        if (user.role == "Patient") {
          var identityCardNumber = user.identityCardNumber;
          var cardName = identityCardNumber + "@tutorial-network";
          await blockchain.patientAcceptRequestOfDoctor(cardName,requestId);
       
          var request = await blockchain.getRequestByPatient(
            cardName,
            identityCardNumber
          );

          var berequest = await blockchain.getRequestBeRequest(
            cardName,
            identityCardNumber
          );
          var result = { request, berequest };
          res.render("request", { data: result });
        }
      } else {
        res.render("login");
      }
    });
  }
);

app.post(
  "/request/reject/",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var requestId = req.body.requestId;
    var requesterRole = req.body.requesterRole;
    var token = req.cookies.access_token;
    var email = parseJwt(token);
    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        if (user.role == "Doctor") {
          var identityCardNumber = user.identityCardNumber;
          var cardName = identityCardNumber + "@tutorial-network";
          if (requesterRole == "Patient") {
            await blockchain.doctorRevokeRequestOfPatient(cardName,requestId);
          }
          if (requesterRole == "Doctor") {
            await blockchain.doctorRevokeRequestOfDoctor(cardName,requestId);
          }          
          var request = await blockchain.getRequestByDoctor(
            cardName,
            identityCardNumber
          );
          var berequest = await blockchain.getRequestBeRequest(
            cardName,
            identityCardNumber
          );
          var result = { request, berequest };
          res.render("request", { data: result });
        }
        if (user.role == "Patient") {
          var identityCardNumber = user.identityCardNumber;
          var cardName = identityCardNumber + "@tutorial-network";
          await blockchain.patientRevokeRequestOfDoctor(cardName,requestId);          
          var request = await blockchain.getRequestByPatient(
            cardName,
            identityCardNumber
          );
          var berequest = await blockchain.getRequestBeRequest(
            cardName,
            identityCardNumber
          );
          var result = { request, berequest };
          res.render("request", { data: result });
        }
      } else {
        res.render("login");
      }
    });
  }
);

app.get(
  "/healthrecord/",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var token = req.cookies.access_token;
    var email = parseJwt(token);

    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        if (user.role == "Doctor") {
          var identityCardNumber = user.identityCardNumber;
          var cardName = identityCardNumber + "@tutorial-network";
          var listAll = await blockchain.listAllHealthRecord(
          );

          var beAuthorized = await blockchain.getHealthRecordByDoctor(
            cardName,
            identityCardNumber
          );
          res.render("listhealthrecord", { data: { listAll, beAuthorized } });
        }
        if (user.role == "Patient") {
          var identityCardNumber = user.identityCardNumber;
          var result=await blockchain.listAllHealthRecordOfPatient(identityCardNumber);
          console.log("this is debug:"+result);
          res.render("patienthealthrecord",{data:result});
        }
      } else {
        res.render("login");
      }
    });
  }
);

app.post(
  "/healthrecord",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var healthRecordId = req.body.healthRecordId;
    var token = req.cookies.access_token;
    var email = parseJwt(token);

    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        if (user.role == "Doctor") {
          var identityCardNumber = user.identityCardNumber;
          var cardName = identityCardNumber + "@tutorial-network";
          
          var result = await blockchain.getDetailHealthRecord(healthRecordId);
          
          res.render("detailhealthrecord", { data: result });
          }
        } else {
          res.render("login");
        }
    });
  }
);

app.post("/createhealthrecord",passport.authenticate("jwt", { failureRedirect: "/login" }),async function (req,res) {
  
  var token = req.cookies.access_token;
  var email = parseJwt(token);
  User.findOne({email:email},async (err,user)=>{
    if(user){
      var identityCardNumber=user.identityCardNumber;
      console.log("identityCardNumber"+identityCardNumber);
      await blockchain.createHealthRecord(identityCardNumber);
      var result=await blockchain.listAllHealthRecordOfPatient(identityCardNumber);
      res.render("index",{data:result});
    }else{  
      res.render("index");
    }
  })
  
})
app.post(
  "/requesthealthrecord",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var token = req.cookies.access_token;
    var email = parseJwt(token);
    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        if (user.role == "Doctor") {
          var requesterRole = "Doctor";
          var resourceOwnerRole = "Patient";
          var resourceType = "HealthRecord";
          var resourceId = req.body.healthRecordId;
          var idRequester = user.identityCardNumber;
          var cardName = idRequester + "@tutorial-network";
          var idResourceOwner = req.body.owner;
          var data = {
            requesterRole,
            resourceOwnerRole,
            resourceType,
            resourceId,
            idRequester,
            idResourceOwner
          };
          await blockchain.createRequest(data);

          var request = await blockchain.getRequestByDoctor(
            cardName,
            idRequester
          );
          console.log("request" + request);

          var berequest = await blockchain.getRequestBeRequest(
            cardName,
            idRequester
          );
          console.log("berequest" + berequest);

          var result = { request, berequest };
          res.render("request", { data: result });

          // var result = await blockchain.getDetailHealthRecord(resourceId);
          // res.render("detailhealthrecord", { data: result });
        }
      } else {
        res.render("login");
      }
    });
  }
);
// app.get(
//   "/healthrecord/detail",
//   passport.authenticate("jwt", { failureRedirect: "/login" }),
//   async function(req, res) {
//     var token = req.cookies.access_token;
//     var email = parseJwt(token);

//     User.findOne({ email: email }, async (err, user) => {
//       if (user) {
//         if (user.role == "Doctor") {
//           var result = await blockchain.getDetailHealthRecord(
//             req.body.healthRecordId
//           );
//           console.log("result: " + result.conclusion);
//           res.render("detailhealthrecord", { data: result });
//         }
//       } else {
//         res.render("login");
//       }
//     });
//   }
// );

app.post(
  "/healthrecord/detail",
  passport.authenticate("jwt", { failureRedirect: "/login" }),
  async function(req, res) {
    var token = req.cookies.access_token;
    var email = parseJwt(token);

    User.findOne({ email: email }, async (err, user) => {
      if (user) {
        if (user.role == "Doctor") {
          var identityCardNumber = user.identityCardNumber;
          var cardName = identityCardNumber + "@tutorial-network";

          var result = await blockchain.getDetailHealthRecord(
            req.body.healthRecordId
          );

          if (result.conclusion != "") {     
            res.render("detailhealthrecord", { data: result });
          } else {
            console.log("req.body.hight"+req.body.hight);
            await blockchain.doctorUpdateHealthRecord(cardName,req.body);
            var result = await blockchain.getDetailHealthRecord(
              req.body.healthRecordId
            );
            
            res.render("detailhealthrecord", { data: result });
          }
        }
      } else {
        res.render("login");
      }
    });
  }
);
app.listen(PORT, function() {
  console.log("Express is running on port 3000");
});

module.exports = { app, parseJwt };
