import { Schema, model, Types } from "mongoose";

interface GroupMemberModel {
  admin: boolean;
  group: Types.ObjectId;
  user: Types.ObjectId;
  messageUnreadCount: number;
}

const groupMemberSchema = new Schema<GroupMemberModel>(
  {
    admin: { type: Boolean, default: false },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageUnreadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("GroupMember", groupMemberSchema);
