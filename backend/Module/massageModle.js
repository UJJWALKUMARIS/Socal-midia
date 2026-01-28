import mongoose from "mongoose";

const massageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    massage: {
        type: String,
        multiline: true,
    },
    image: {
        type: String,
    },
}, {
    timestamps: true,
});

const Massage = mongoose.model("Massage", massageSchema);

export default Massage;