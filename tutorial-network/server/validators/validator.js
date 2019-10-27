const User = require('../models/UserModels');


exports.UserValidator = function(req,res,next){
  
    req.check('email','Invalid email').isEmail();
    req.check('email', 'Email is required.').not().isEmpty();
    req.check('password', 'Password is required.').not().isEmpty();
    req.check('password', 'Password must be more than 6 characters').isLength({min:6});
    req.check('card_name', 'Card Name is required.').not().isEmpty();
    const errors=req.validationErrors();
    if(errors){
        const firstError=errors.map(error=>error.msg)[0];
        return res.status(400).json({error: firstError});
    }
    next();
   
}