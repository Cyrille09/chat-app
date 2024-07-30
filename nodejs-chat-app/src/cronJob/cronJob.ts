import { CronJob } from "cron";
import fs from "fs";
import path from "path";
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

    // delete story feed images
    fs.readdir("images/stories", async (err, files) => {
      if (err) {
      }
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif)$/.test(file)
      );

      if (imageFiles.length) {
        for (const imageFile of imageFiles) {
          const deleteImage = await StoryFeed.findOne({
            type: "image",
            message: imageFile,
          });

          if (!deleteImage) fs.unlinkSync(`images/stories/${imageFile}`);
        }
      }
    });
  }
);
