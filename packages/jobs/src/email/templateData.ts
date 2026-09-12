import z from "zod";
import { emailTemplates, type EmailTemplateName } from "./templates.js";

const emailTemplateDataSchemas = {
  welcome: z.object({
    name: z.string(),
    dashboardLink: z.url(),
  }),

  welcomeBack: z.object({
    name: z.string(),
    time: z.coerce.date(),
    deviceInfo: z.string(),
  }),

  loginAlert: z.object({
    name: z.string(),
    time: z.coerce.date(),
    deviceInfo: z.string(),
  }),

  emailVerification: z.object({
    name: z.string(),
    verificationUrl: z.url(),
    deletionScheduledAt: z.coerce.date(),
    tokenExpiresAt: z.coerce.date(),
  }),

  passwordReset: z.object({
    name: z.string(),
    resetUrl: z.url(),
  }),

  passwordChangedAlert: z.object({
    name: z.string(),
    time: z.coerce.date(),
  }),

  emailChangeRequest: z.object({
    name: z.string(),
    changeEmailUrl: z.url(),
  }),

  emailChangeVerification: z.object({
    otp: z.string(),
  }),

  emailChangedAlert: z.object({
    name: z.string(),
    oldEmail: z.email(),
    newEmail: z.email(),
    time: z.coerce.date(),
  }),

  emailChangedConfirmation: z.object({
    name: z.string(),
    newEmail: z.email(),
    time: z.coerce.date(),
  }),

  accountDeletionAlert: z.object({
    name: z.string(),
    date: z.coerce.date(),
  }),

  accountDeactivationAlert: z.object({
    name: z.string(),
  }),
};

type EmailTemplateData = {
  [K in EmailTemplateName]: z.infer<(typeof emailTemplateDataSchemas)[K]>;
};

type EmailJobData<T extends EmailTemplateName> = {
  to: string;
  template: T;
  data: EmailTemplateData[T];
};

function parseEmailJobData(input: unknown): EmailJobData<EmailTemplateName> {
  const parsedData = z
    .object({
      to: z.email(),
      template: z.enum(Object.keys(emailTemplates) as EmailTemplateName[]),
      data: z.unknown(),
    })
    .parse(input);

  const { to, template, data } = parsedData;

  const dataResult = emailTemplateDataSchemas[template].parse(data);

  return {
    to: to,
    template: template,
    data: dataResult,
  };
}

export { parseEmailJobData };
export type { EmailJobData, EmailTemplateData };
