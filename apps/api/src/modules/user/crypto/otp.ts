import { randomInt } from "node:crypto";

const OTP_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const otpCharsLength = OTP_CHARS.length;

const generateOtp = (length = 8) => {
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += OTP_CHARS[randomInt(otpCharsLength)];
  }

  return otp;
};

export { generateOtp };
