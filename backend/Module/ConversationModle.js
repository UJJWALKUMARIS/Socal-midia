import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    massages:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Massage",
        }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);