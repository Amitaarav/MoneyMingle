const mongoose = require("mongoose");
const { number } = require("zod");

mongoose.connect("mongodb://localhost:27017/paytm")

const {schema} = mongoose;

const userSchema =mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    firstName:{
        type:String,
        required:true,
        maxLength:50,
        true:true
    },
    lastName:{
        type:String,
        required:true,
        minLength:6,
        maxLength:50,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        uppercase:true,
        number:true,
        minLength:8
        

    }

})

const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, //reference to user model
        ref:"User",
        required:true
    },
    balance:{
        type:Number,
        required:true
    }

})
// to store balance in 2 decimal places
accountSchema.pre('save', function (next) {
    if (this.isModified('balance')) {
        this.balance = parseFloat(this.balance.toFixed(2));
    }
    next();
});

const Account = mongoose.model("Account",accountSchema);
const User = mongoose.model("User",userSchema);
module.exports={
    User,
    Account
}