import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  midiaType: {
    type: String,
    enum: ["text", "image", "video"],
    required: true
  },

  midia: {
    type: String,
    required: true
  },

  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  // TTL FIELD
  createdAt: {
    type: Date,
    default: Date.now,   // FIXED
    expires: 60 * 60 * 24 // 24 hours (TTL)
  }

});

// NO timestamps: true   (TTL won't work if timestamps is on)

const Story = mongoose.model("Story", postSchema);
export default Story;