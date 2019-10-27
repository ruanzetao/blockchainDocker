const User=require('../models/UserModels');
const bcrypt=require('bcrypt');

exports.register=function(req,res,next){
    //console.log("Register!");
    User.findOne({email:req.body.email},(err,user)=>{
        if(user==null){ //Ktra xem email da duoc su dung chua
            bcrypt.hash(req.body.password,10,function(err,hash){//Ma hoa password truoc khi luu vao db
                if(err){
                    return next(err);}
                const user=new User(req.body);
                
                user.password=hash;
                user.card_name=req.body.card_name;
                user.role=req.body.role;
                user.save((err,result)=>{
                    if(err){
                        return res.json({err})}
                    res.json({user:result})
                })
            });
        }else{
            res.json({err:'Email has been used'});
        }
    })
}

exports.login=function(req,res){
    User.findOne({email:req.body.email}).exec(function(err,user){
        if(err){
            return res.json({err});
        }else if (!user){
            return res.json({err:'Email and Password are incorrect'});
        }
        bcrypt.compare(req.body.password,user.password,(err,result)=>{
            if(result===true){
                //console.log(user.password);
                console.log(req.session);
                req.session.user=user;
                res.json({
                    user:user,
                    "login":"success"
                })
                }else{
                    return res.json({err:'Username and Password are incorrect'});
            }
        })
    })
}

exports.logout= function(req,res){
    if(req.session){
        req.session.destroy(function(err){
            if(err){
                return res.json({err});
            }else{
                return res.json({'logout':"Success"});
            }
        });
    }
}
