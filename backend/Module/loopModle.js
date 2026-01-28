import mongoose from 'mongoose';

const loopSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            message: {
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

const Loop = mongoose.model("Loop", loopSchema);

export default Loop;