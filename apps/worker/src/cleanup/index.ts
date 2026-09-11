import cron from "node-cron";
import { JobLogger } from "@/shared/jobLogger.js";
import { deleteExpiredUsers } from "./deleteExpiredUsers.js";

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
}

export { startCleanupScheduler };
