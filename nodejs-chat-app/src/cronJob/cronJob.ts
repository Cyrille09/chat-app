import { CronJob } from "cron";
import Message from "../models/Message";

export const DisappearCronJob = new CronJob("0 0-23/1 * * *", async () => {
  await Message.updateMany(
    {
      disappear: "yes",
      disappearTime: { $type: "date", $lt: new Date() },
    },
    {
      $set: { disappear: "disappeared" },
    }
  );
});
