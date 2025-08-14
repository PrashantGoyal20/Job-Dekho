import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        minlength:[3,"Minimun Character Length must be at least 3"],
        maxlength:[30,"Maximum Character Length must be at most 30"],
        
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    phone:{
        type:Number,
        required:[true,"Please enter your phone number"],
    },
    password:{
        type:String,
    },
  
    role:{
        type:String,
        required:[true,"Please enter your role"],
        enum:["Job Seeker","Job Manager"],

    },
    date:{
        type:Date,
        default:Date.now
    },
    savedJobs:{
        type:[mongoose.Schema.ObjectId],
        ref:"Jobs"
    },
    city:{
        type:String,
        required:true,
    }

})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_KEY,{expiresIn:process.env.JWT_EXPIRY});
}

export const User = mongoose.model("User", userSchema);