import nodemailer from "nodemailer";
import { env } from "@/config/env.js";
import { constants } from "@/config/constants.js";
import { renderEmail } from "./renderEmail.js";

import type { EmailTemplateName, EmailJobData } from "@repo/jobs/email";
import { mapNodeMailerError } from "@/shared/errors/mappers/index.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

const subjects: Record<EmailTemplateName, string> = {
  welcome: `Welcome to ${constants.appName}`,
  welcomeBack: `Welcome Back to ${constants.appName}`,
  loginAlert: "New Sign-In to Your Account",
  emailVerification: "Verify Your Email Address",
  passwordReset: "Reset Your Password",
  emailChangeVerification: "Verify Your New Email Address",
  emailChangeRequest: "Email Change Request",
  emailChangedAlert: "Your Email Address Was Changed",
  emailChangedConfirmation: "Email Address Change Confirmed",
  accountDeletionAlert: "Your Account Deletion Request",
  passwordChangedAlert: "Your Password Was Changed",
  accountDeactivationAlert: "Your Account Has Been Deactivated",
} as const;

const sendEmail = async <T extends EmailTemplateName>(config: EmailJobData<T>) => {
  const emailHtml = renderEmail(config.template, config.data);

  try {
    await transporter.sendMail({
      from: `"${constants.appName}" <${env.SMTP_USER}>`,
      to: config.to,
      subject: subjects[config.template],
      html: emailHtml,
    });
  } catch (error) {
    throw mapNodeMailerError(error);
  }
};

export { sendEmail };
