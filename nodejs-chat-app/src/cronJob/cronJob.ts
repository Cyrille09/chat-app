import { CronJob } from "cron";
import Message from "../models/Message";
import StoryFeed from "../models/StoryFeed";

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

export const DeletestoryFeedsCronJob = new CronJob(
  "0 0-23/1 * * *",
  async () => {
    await StoryFeed.deleteMany({
      toBedeletedAt: { $type: "date", $lt: new Date() },
    });
  }
);
