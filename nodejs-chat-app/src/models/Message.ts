import { Schema, model, Types } from "mongoose";

interface MessageModel {
  message: string;
  type: "image" | "audio" | "video" | "text" | "document" | "link" | "action";
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
  disappear: "no" | "yes" | "disappeared";
  disappearTime: Date;
  editMessage: boolean;
  stars: [
    {
      user: Types.ObjectId;
    }
  ];
}

const messageSchema = new Schema<MessageModel>(
  {
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["image", "audio", "video", "text", "document", "link", "action"],
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
    stars: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    editMessage: {
      type: Boolean,
      default: false,
    },
    disappear: {
      type: String,
      enum: ["no", "yes", "disappeared"],
      default: "no",
    },
    disappearTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default model("Message", messageSchema);
