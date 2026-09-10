import Handlebars from "handlebars";
import { type EmailTemplateName } from "@repo/jobs/email";

import { welcomeTemplate } from "./welcome.js";
import { welcomeBackTemplate } from "./welcomeBack.js";
import { loginAlertTemplate } from "./loginAlert.js";

import { emailVerificationTemplate } from "./emailVerification.js";
import { passwordResetTemplate } from "./passwordReset.js";

import { emailChangeVerificationTemplate } from "./emailChangeVerification.js";
import { emailChangeRequestTemplate } from "./emailChangeRequest.js";
import { emailChangedAlertTemplate } from "./emailChangedAlert.js";
import { emailChangedConfirmationTemplate } from "./emailChangedConfirmation.js";

import { accountDeletionAlertTemplate } from "./accountDeletionAlert.js";
import { accountDeactivationAlertTemplate } from "./accountDeactivationAlert.js";
import { passwordChangedAlertTemplate } from "./passwordChangedAlert.js";

const templates: Record<EmailTemplateName, HandlebarsTemplateDelegate<unknown>> = {
  welcome: Handlebars.compile(welcomeTemplate),
  welcomeBack: Handlebars.compile(welcomeBackTemplate),
  loginAlert: Handlebars.compile(loginAlertTemplate),
  emailVerification: Handlebars.compile(emailVerificationTemplate),
  passwordReset: Handlebars.compile(passwordResetTemplate),
  emailChangeVerification: Handlebars.compile(emailChangeVerificationTemplate),
  emailChangeRequest: Handlebars.compile(emailChangeRequestTemplate),
  emailChangedAlert: Handlebars.compile(emailChangedAlertTemplate),
  emailChangedConfirmation: Handlebars.compile(emailChangedConfirmationTemplate),
  accountDeletionAlert: Handlebars.compile(accountDeletionAlertTemplate),
  accountDeactivationAlert: Handlebars.compile(accountDeactivationAlertTemplate),
  passwordChangedAlert: Handlebars.compile(passwordChangedAlertTemplate),
};

export { templates };
