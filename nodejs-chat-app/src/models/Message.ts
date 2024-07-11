import { Schema, model, Types } from "mongoose";

interface MessageModel {
  message: string;
  type: "image" | "audio" | "video" | "text" | "document" | "link";
  group: Types.ObjectId;
  receiver: Types.ObjectId;
  sender: Types.ObjectId;
  deleteMessage: [
    {
      user: Types.ObjectId;
      date: Date;
    }
  ];
  isGroup: boolean;
}

const messageSchema = new Schema<MessageModel>(
  {
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["image", "audio", "video", "text", "document", "link"],
      trim: true,
      default: "text",
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deleteMessage: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        date: {
          type: Date,
        },
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("Message", messageSchema);
