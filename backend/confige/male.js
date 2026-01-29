import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER, // SMTP LOGIN
    pass: process.env.BREVO_PASS, // SMTP KEY
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

/* 🔍 DEBUG */
transporter.verify((err) => {
  if (err) console.error("SMTP ERROR ❌", err);
  else console.log("SMTP CONNECTED ✅");
});

const otpTemplate = (title, subtitle, otp, color) => `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    <div style="max-width:520px; margin:auto; background:#fff; padding:25px; border-radius:10px;">
      <h2 style="color:${color}; text-align:center;">${title}</h2>
      <p>Hello 👋</p>
      <p>${subtitle}</p>
      <div style="text-align:center;font-size:32px;letter-spacing:8px;font-weight:bold;background:#f1f3f4;padding:15px;border-radius:8px;margin:20px 0;">
        ${otp}
      </div>
      <p>⏰ OTP valid for <b>5 minutes</b>. Do not share it.</p>
      <hr />
      <p style="font-size:12px;text-align:center;">
        © ${new Date().getFullYear()} Vybe
      </p>
    </div>
  </div>
`;

export const sendSignupMail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Vybe Security" <${process.env.BREVO_FROM}>`,
    to,
    subject: "Welcome to Vybe 🎉",
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
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
    from: `"Vybe Security" <${process.env.BREVO_FROM}>`,
    to,
    subject: "Reset Your Password 🔐",
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    html: otpTemplate(
      "Reset Password 🔐",
      "Use the OTP below to reset your password:",
      otp,
      "#e53935"
    ),
  });
};
