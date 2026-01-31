import express from "express";
import {
  signUpOtp,
  verifyOtpSignup,
  signIn,
  signOut,
  forgotPasswordOtp,
  verifyForgotOtp,
  resetPassword,
  deleteUser,
  simpleSignUp,
} from "../Controlers/auathControlers.js";
import islogin from "../Midlewhere/isLogin.js";

const router = express.Router();

router.post("/signup-otp", signUpOtp);
router.post("/verify-signup-otp", verifyOtpSignup);
router.post("/signin", signIn);
router.get("/signout", islogin , signOut);
router.post("/forgot-password-otp", forgotPasswordOtp);
router.post("/verify-forgot-password-otp", verifyForgotOtp);
router.post("/reset-password", resetPassword);
router.delete("/delete-account/:userId", deleteUser);
router.post("/signup-simple", simpleSignUp);

export default router;
