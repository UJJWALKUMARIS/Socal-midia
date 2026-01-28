import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },

  otp: { type: String, required: true },
  otpExpire: { type: Date, required: true },
}, { timestamps: true });

// Auto delete after 10 minutes
tempUserSchema.index({ otpExpire: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("TempUser", tempUserSchema);
