import { Schema, model, Types } from "mongoose";

interface BlockContactUserModel {
  user: Types.ObjectId;
  userBlock: Types.ObjectId;
}

const blockContactUserSchema = new Schema<BlockContactUserModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userBlock: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("BlockContactUser", blockContactUserSchema);
