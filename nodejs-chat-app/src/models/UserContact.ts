import "dotenv/config";
import { Schema, Types, model } from "mongoose";

interface userContactModel {
  users: [
    {
      user: Types.ObjectId;
      blockStatus: boolean;
      latestMessage: Types.ObjectId;
      messageUnreadCount: number;
      muteDate: Date;
      isGroup: boolean;
      group: Types.ObjectId;
      updatedAt: Date;
      disappearIn: "" | "2 mins" | "6 hours" | "1 day" | "1 week";
    }
  ];
  user: Types.ObjectId;
}

const userContactSchema = new Schema<userContactModel>(
  {
    users: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        blockStatus: {
          type: Boolean,
          default: false,
        },
        latestMessage: {
          type: Schema.Types.ObjectId,
          ref: "Message",
        },
        messageUnreadCount: {
          type: Number,
          default: 0,
        },

        muteDate: {
          type: Date,
        },
        isGroup: {
          type: Boolean,
          default: false,
        },
        group: {
          type: Schema.Types.ObjectId,
          ref: "Group",
        },
        updatedAt: {
          type: Date,
          default: new Date(),
        },
        disappearIn: {
          type: String,
          enum: ["", "2 mins", "6 hours", "1 day", "1 week"],
        },
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default model("UserContact", userContactSchema);
