import { Schema, model, Types } from "mongoose";

interface MediaModel {
  name: string;
  photoUrl: string;
  message: Types.ObjectId;
}

const mediaSchema = new Schema<MediaModel>(
  {
    name: { type: String, required: false, trim: true },
    photoUrl: { type: String, trim: true },
    message: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Media", mediaSchema);
