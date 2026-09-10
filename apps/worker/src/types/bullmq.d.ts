import "bullmq";
import { type JobLogger } from "@/shared/jobLogger.ts";

declare module "bullmq" {
  interface Job {
    jobLogger: JobLogger;
  }
}
