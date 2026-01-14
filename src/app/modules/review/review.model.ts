import { Schema, model } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true },
    book: { type: Schema.Types.ObjectId, 
      ref: "Book", 
      required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Review = model<IReview>("Review", reviewSchema);
