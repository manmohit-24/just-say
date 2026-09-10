const EMAIL_QUEUE_NAME = "email";
const EMAIL_JOB_NAME = "send-email";

export { EMAIL_JOB_NAME, EMAIL_QUEUE_NAME };
export { emailTemplates, type EmailTemplateName } from "./templates.js";
export { parseEmailJobData, type EmailJobData, type EmailTemplateData } from "./templateData.js";
