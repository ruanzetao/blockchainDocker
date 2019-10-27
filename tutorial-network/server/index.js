const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const router = require('../server/routes/routes');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();
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
app.use(expressValidator());

// app.get("/",function(req,res){
//     res.render("home");
// })
app.use(session({
    secret:'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection:db
    })
}));

app.use('/', router);
app.listen(PORT, () => {console.log("Server started on http://localhost:"+PORT)});


//app.use('/login', router);
module.exports = app;