import User from "../Module/userModle.js";
import TempUser from "../Module/temproyModle.js";
import bcrypt from "bcryptjs";
import genToken from "../confige/token.js";
import { sendSignupMail, sendResetMail } from "../confige/male.js";
import Post from "../Module/postModle.js";
import Loop from "../Module/loopModle.js";
import Story from "../Module/soryModle.js";
import Massage from "../Module/massageModle.js";

// OTP generator
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

/* =========================
   SIGNUP → SEND OTP
========================= */
export const signUpOtp = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;

    if (!name || !userName || !email || !password)
      return res.status(400).json({ message: "All fields are required!" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters!" });

    const exists = await User.findOne({ $or: [{ email }, { userName }] });
    if (exists) return res.status(400).json({ message: "User already exists!" });

    // remove old temp user
    await TempUser.deleteOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    await TempUser.create({
      name,
      userName,
      email,
      password: hashedPassword,
      otp: await bcrypt.hash(String(otp), 10),
      otpExpire: Date.now() + 5 * 60 * 1000,
    });

    await sendSignupMail(email, otp);

    res.status(200).json({ message: "OTP sent to email. Verify to continue." });
  } catch (error) {
    res.status(500).json({ message: `Signup OTP error: ${error.message}` });
  }
};

/* =========================
   VERIFY OTP → CREATE USER
========================= */
export const verifyOtpSignup = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = await TempUser.findOne({ email });
    if (!tempUser || tempUser.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired or invalid!" });
    }

    const isValidOtp = await bcrypt.compare(String(otp), tempUser.otp);
    if (!isValidOtp)
      return res.status(400).json({ message: "Wrong OTP!" });

    const user = await User.create({
      name: tempUser.name,
      userName: tempUser.userName,
      email: tempUser.email,
      password: tempUser.password,
    });

    await TempUser.deleteOne({ email });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userData } = user._doc;

    res.status(201).json({
      message: "Signup successful!",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: `Verify OTP error: ${error.message}` });
  }
};

/* =========================
   SIGNIN
========================= */
export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user) return res.status(400).json({ message: "Invalid credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   SIGNOUT
========================= */
export const signOut = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully!" });
};

/* =========================
   FORGOT PASSWORD → SEND OTP
========================= */
export const forgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found!" });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(String(otp), 10);

    await sendResetMail(email, otp);

    Object.assign(user, {
      resetOtp: hashedOtp,
      expireOtp: Date.now() + 5 * 60 * 1000,
      isOtpVeryfied: false,
    });

    await user.save();

    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.expireOtp < Date.now()) {
      return res.status(400).json({ message: "OTP expired!" });
    }

    const isValidOtp = await bcrypt.compare(String(otp), user.resetOtp);
    if (!isValidOtp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    Object.assign(user, {
      resetOtp: null,
      expireOtp: null,
      isOtpVeryfied: true,
    });

    await user.save();

    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isOtpVeryfied) {
      return res.status(400).json({ message: "OTP not verified!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    Object.assign(user, {
      password: hashedPassword,
      isOtpVeryfied: false,
    });

    await user.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if user exists first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove this user from all their followers' "following" lists
    if (user.flowers && user.flowers.length > 0) {
      await User.updateMany(
        { _id: { $in: user.flowers } },
        { $pull: { following: userId } }
      );
    }

    // Remove this user from all users they follow's "followers" lists
    if (user.following && user.following.length > 0) {
      await User.updateMany(
        { _id: { $in: user.following } },
        { $pull: { flowers: userId } }
      );
    }

    //Post
    await Post.deleteMany({ author: userId });
    await Post.updateMany(
      { "comments.user": userId },
      { $pull: { comments: { user: userId } } }
    )

    await Post.updateMany(
      { likes: userId },
      { $pull: { likes: userId } }
    );

    //Loop
    await Loop.deleteMany({ author: userId });

    await Loop.updateMany(
      { "comments.author": userId },
      { $pull: { comments: { author: userId } } }
    );

    await Loop.updateMany(
      { likes: userId },
      { $pull: { likes: userId } }
    );

    await Story.deleteOne({ author: userId });

    await Massage.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }]
    });

    // Delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: `${error}`,
    });
  }
};
