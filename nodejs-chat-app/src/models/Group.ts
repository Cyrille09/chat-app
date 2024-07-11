import { Schema, model, Types } from "mongoose";

interface GroupModel {
  name: string;
  photoUrl: string;
  creator: Types.ObjectId;
  description: string;
  latestMessage: Types.ObjectId;
  latestSender: Types.ObjectId;
}

const groupSchema = new Schema<GroupModel>(
  {
    name: { type: String, required: true, trim: true },
    photoUrl: { type: String, trim: true, default: "" },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: false, trim: true },
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    latestSender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model("Group", groupSchema);
