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
  try {
    return await Review.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { status: "approved" },
      { new: true }
    );
  } catch (err) {
    throw err;
  }
};

export const ReviewService = {
  createReview,
  getApprovedByBook,
  approveReview,
};
