import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const otpTemplate = (title, subtitle, otp, color) => `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    <div style="max-width:520px; margin:auto; background:#fff; padding:25px; border-radius:10px;">
      <h2 style="color:${color}; text-align:center;">${title}</h2>
      <p>Hello 👋</p>
      <p>${subtitle}</p>

      <div style="
        text-align:center;
        font-size:32px;
        letter-spacing:8px;
        font-weight:bold;
        background:#f1f3f4;
        padding:15px;
        border-radius:8px;
        margin:20px 0;
      ">
        ${otp}
      </div>

      <p style="margin-top:20px;">
        ⏰ This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.
      </p>

      <hr />
      <p style="font-size:12px; color:#888; text-align:center;">
        © ${new Date().getFullYear()} Vybe. All rights reserved.
      </p>
    </div>
  </div>
`;


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