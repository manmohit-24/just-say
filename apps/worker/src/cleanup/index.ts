import cron from "node-cron";
import { JobLogger } from "@/shared/jobLogger.js";
import { deleteExpiredUsers } from "./deleteExpiredUsers.js";
import { deleteExpiredSessions } from "./deleteExpiredSessions.js";
import { deleteOrphanedMessages } from "./deleteOrphanMessages.js";

function startCleanupScheduler() {
  // Every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    const jobLogger = new JobLogger({ name: "Delete-Expired-Users" });
    try {
      const deleted = await deleteExpiredUsers();
      jobLogger.options.info = { deleted };
      jobLogger.complete();
    } catch (error) {
      jobLogger.fail(error);
    }
  });

  // Every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    const jobLogger = new JobLogger({ name: "Delete-Expired-Sessions" });
    try {
      const deleted = await deleteExpiredSessions();
      jobLogger.options.info = { deleted };
      jobLogger.complete();
    } catch (error) {
      jobLogger.fail(error);
    }
  });

  // Every day at midnight
  cron.schedule("0 0 * * *", async () => {
    const jobLogger = new JobLogger({ name: "Delete-Orphaned-Messages" });
    try {
      const deleted = await deleteOrphanedMessages();
      jobLogger.options.info = { deleted };
      jobLogger.complete();
    } catch (error) {
      jobLogger.fail(error);
    }
  });
}

export { startCleanupScheduler };
