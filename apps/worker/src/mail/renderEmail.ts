import Handlebars from "handlebars";
import { type EmailTemplateData } from "@repo/jobs/email";
import { constants } from "@/config/constants.js";
import { styles } from "./styles.js";
import { templates } from "./templates/index.js";
import { type EmailTemplateName } from "@repo/jobs/email";

Handlebars.registerHelper("formatDate", (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
});

const renderEmail = <T extends EmailTemplateName>(template: T, data: EmailTemplateData[T]) => {
  return templates[template]({ styles, appName: constants.appName, ...data });
};

export { renderEmail };
