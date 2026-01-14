import mongoose from "mongoose";
import { Review } from "./review.model";

const createReview = async (payload: any) => {
  try {
    return await Review.create(payload);
  } catch (err) {
    throw err;
  }
};

const getApprovedByBook = async (bookId: string) => {
  try {
    return await Review.find({
      book: bookId,
      status: "approved",
      isDeleted: false,
    }).populate("user", "name email");
  } catch (err) {
    throw err;
  }
};

const approveReview = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid review id");
  }

  const updated = await Review.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id), isDeleted: { $ne: true } },
    { status: "approved" },
    { new: true }
  );

  if (!updated) {
    throw new Error("Review not found or deleted");
  }

  return updated;
};

export const ReviewService = {
  createReview,
  getApprovedByBook,
  approveReview,
};
