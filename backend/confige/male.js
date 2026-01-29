import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpMail = async (to, otp, type = "signup") => {
  const subject =
    type === "signup" ? "Verify your Vybe account" : "Reset your password";

  const html = `
    <div style="font-family:Arial;padding:20px">
      <h2>${subject}</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing:5px">${otp}</h1>
      <p>Valid for 5 minutes ⏰</p>
      <p>Do not share this OTP with anyone.</p>
    </div>
  `;

  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html,
  });
};