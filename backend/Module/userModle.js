import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required:true,
        unique:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true,
    },
    profilePic:{
        type: String,
    },
    flowers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    saved:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    loops:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Loop"
        }
    ],
    story:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Story"
    },
    resetOtp: {
        type: String
    },
    expireOtp: {
        type: Date
    },
    isOtpVeryfied: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String
    },
    profacation: {
        type: String
    },
},{timestamps: true});

const User = mongoose.model("User" , userSchema);

export default User;