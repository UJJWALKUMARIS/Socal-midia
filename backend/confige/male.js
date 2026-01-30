import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendSignupMail = async (to, otp) => {
  await resend.emails.send({
    from: "Vybe Security <onboarding@resend.dev>",
    to: [to],
    subject: "Welcome to Vybe",
    html: otpTemplate(
      "Welcome to Vybe 🎉",
      "Use the OTP below to verify your account:",
      otp,
      "#1a73e8"
    ),
  });
};

export const sendResetMail = async (to, otp) => {
  await resend.emails.send({
    from: "Vybe Security <onboarding@resend.dev>",
    to: [to],
    subject: "Reset Your Password",
    html: otpTemplate(
      "Reset Password 🔐",
      "Use the OTP below to reset your password:",
      otp,
      "#e53935"
    ),
  });
};