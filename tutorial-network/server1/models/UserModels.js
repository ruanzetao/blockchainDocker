const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema=new Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true, minlength: 6},
    card_name:{type: String, required:true},  
    role: {type: String, enum: ['Doctor', 'Patient']},
    createdAt: {type:Date, default:Date.now},
    deleted:{type:Boolean, default:false},
    __v:{type:Number, select:false}    
});

userSchema.statics.getUser = function (email) {
    return this.findOne({ email: email });
  };

userSchema.statics.getUsers = function(){
    return this.find();
};

module.exports = mongoose.model('User', userSchema)