import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type:{
        type: String,
        enum: ["like", "comment", "follow"],
        required: true
    },
    message:{
        type: String,
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    loop:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loop",
    },
    isRead:{
        type: Boolean,
        default: false
    }
},{timestamps:true});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;