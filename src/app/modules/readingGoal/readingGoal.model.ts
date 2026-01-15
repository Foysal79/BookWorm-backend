import { model, Schema } from "mongoose";
import { IReadingGoal } from "./readingGoal.interface";
import { string } from "zod";

const schema = new Schema<IReadingGoal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    period: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },
    targetBook: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
schema.index({ user: 1, isActive: 1 });
export const ReadingGoal = model<IReadingGoal>("ReadingGoal", schema);
