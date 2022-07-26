const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({

    email:{
        type:String,
        required:[true,"Please provide a valid email"],
        unique:[true,"Email exists"]
    },
    password:{
        type:String,
        required:[true,"Please provide a password"],
        unique:false
    },
});

module.exports=mongoose.model.Users || mongoose.model("Users",userSchema)