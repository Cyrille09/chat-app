import { addDays } from "date-fns";
import { Schema, model, Types } from "mongoose";

interface StoryFeedModel {
  message: string;
  type: "image" | "video" | "text";
  toBedeletedAt: Date;
  user: Types.ObjectId;
}

const storyFeedSchema = new Schema<StoryFeedModel>(
  {
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["image", "video", "text"],
      trim: true,
      default: "text",
    },
    toBedeletedAt: {
      type: Date,
      default: addDays(new Date(), 1),
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("StoryFeed", storyFeedSchema);
