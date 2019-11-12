const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema=new Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true, minlength: 6}, 
    role: {type: String, enum: ['Doctor', 'Patient']},
    name:{type: String, required:true}, 
    address:{type: String, required:true}, 
    phone:{type: String, required:true}, 
    gender:{type: String, required:true,enum:['Male','Female','Other']}, 
    identityCardNumber:{type: String, required:true}, 
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