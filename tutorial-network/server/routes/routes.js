const express = require('express');
const router = express.Router();
const {register,login,logout} = require('../controllers/UserController');
const {UserValidator} = require('../validators/validator');

router.post('/register', UserValidator , register);

function requiresLogout(req,res,next){
    if(req.session&&req.session.user){
        return res.json({err:'You must be Logout in to Login continue'});
    }else{
        return next();
    }
}

router.post('/login', requiresLogout, login);

function requiresLogin(req,res,next){
    if(req.session&&req.session.user){
        return next();
    }else{
        return res.json({err:'You must be logged in to view this page.'});
    }
}
router.get('/logout',requiresLogin,logout);

module.exports = router;