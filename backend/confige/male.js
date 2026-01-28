import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Shared OTP template (email-safe copy UX)
const otpTemplate = (title, subtitle, otp, color) => `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    <div style="max-width:520px; margin:auto; background:#fff; padding:25px; border-radius:10px;">

      <h2 style="color:${color}; text-align:center;">${title}</h2>
      <p>Hello 👋</p>
      <p>${subtitle}</p>

      <!-- OTP BOX -->
      <div style="
        text-align:center;
        font-size:32px;
        letter-spacing:8px;
        font-weight:bold;
        background:#f1f3f4;
        padding:15px;
        border-radius:8px;
        margin:20px 0;
        user-select: all;
      ">
        ${otp}
      </div>

      <!-- COPY LOOK BUTTON -->
      <div style="text-align:center;">
        <span style="
          display:inline-block;
          padding:10px 18px;
          background:${color};
          color:white;
          border-radius:6px;
          font-size:14px;
        ">
          📋 Tap & Hold to Copy OTP
        </span>
      </div>

      <p style="margin-top:20px;">
        ⏰ This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.
      </p>

      <p style="color:#555;">
        If you did not request this, please ignore this email.
      </p>

      <hr style="margin:25px 0;" />
      <p style="font-size:12px; color:#888; text-align:center;">
        © ${new Date().getFullYear()} Vybe. All rights reserved.
      </p>
    </div>
  </div>
`;

export const sendSignupMail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Vybe Security" <${process.env.EMAIL}>`,
    to,
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
  await transporter.sendMail({
    from: `"Vybe Security" <${process.env.EMAIL}>`,
    to,
    subject: "Reset Your Password",
    html: otpTemplate(
      "Reset Password 🔐",
      "Use the OTP below to reset your password:",
      otp,
      "#e53935"
    ),
  });
};