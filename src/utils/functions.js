import redis from "redis";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

export const commonReturn = (res, message, data, status = 200) =>
  res.status(status).send({
    message,
    data,
  });

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTPViaSendGrid = async (email) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const redisClient = redis.createClient({ url: process.env.REDIS_URL });
  await redisClient.connect();

  const OTP_EXPIRY_SECONDS =
    parseInt(process.env.OTP_EXPIRES_IN_MINUTES || "5") * 60;

  const otp = generateOTP();
  await redisClient.setEx(`otp:${email}`, OTP_EXPIRY_SECONDS, otp);

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Your OTP Code",
    html: `<div style="font-family:sans-serif">
      <h2>Email Verification</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This code is valid for ${OTP_EXPIRY_SECONDS / 60} minutes.</p>
    </div>`,
  };

  await sgMail.send(msg);
};

export const sendLinkViaSendGrid = async (email) => {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Your OTP Code",
    html: `<div style="font-family:sans-serif">
      <h2>Register your account</h2>
      <p>Register your account using this URL : <a href={${process.env.EMAIL_REGISTER_URL}}></p>
    </div>`,
  };

  await sgMail.send(msg);
};
