import { Schema, model } from "mongoose";
import { ITutorial } from "./tutorial.interface";

const schema = new Schema<ITutorial>(
  {
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true, trim: true },
    description: { type: String },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Tutorial = model<ITutorial>("Tutorial", schema);
