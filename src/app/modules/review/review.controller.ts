import { Response } from "express";
import mongoose from "mongoose";
import { ReviewService } from "./review.service";
import { reviewValidationSchema } from "./review.validation";
import { AuthRequest } from "../../middlewares/auth.middleware";

const create = async (req: AuthRequest, res: Response) => {
  try {
    const { body } = reviewValidationSchema.reviewValidation.parse({
      body: req.body,
    });

    const review = await ReviewService.createReview({
      user: req.user!.userId,
      ...body,
    });

    res.status(201).json({ success: true, data: review });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getByBook = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookId as any)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid book id" });
    }

    const reviews = await ReviewService.getApprovedByBook(bookId as any);
    res.status(200).json({ success: true, data: reviews });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const approve = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await ReviewService.approveReview(req.params.id as any);
    res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const ReviewController = {
  create,
  getByBook,
  approve,
};
