import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    midiaType: {
        type: String,
        enum: ["image", "video"],
        required: true
    },
    midia: {
        type: String,
        required: true
    },
    caption: {
        type: String,
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            text: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true });


const Post = mongoose.model("Post", postSchema);

export default Post;