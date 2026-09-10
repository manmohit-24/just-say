const emailTemplates = {
  welcome: "welcome",
  welcomeBack: "welcomeBack",

  loginAlert: "loginAlert",

  emailVerification: "emailVerification",

  passwordReset: "passwordReset",
  passwordChangedAlert: "passwordChangedAlert",

  emailChangeRequest: "emailChangeRequest",
  emailChangeVerification: "emailChangeVerification",
  emailChangedAlert: "emailChangedAlert",
  emailChangedConfirmation: "emailChangedConfirmation",

  accountDeletionAlert: "accountDeletionAlert",
  accountDeactivationAlert: "accountDeactivationAlert",
} as const;

type EmailTemplateName = keyof typeof emailTemplates;

export { emailTemplates };
export type { EmailTemplateName };
