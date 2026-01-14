import { Types } from "mongoose";

export type TReviewStatus = "pending" | "approved";

export interface IReview {
  user: Types.ObjectId;
  book: Types.ObjectId;
  rating: number;
  comment?: string;
  status: TReviewStatus;
  isDeleted: boolean;
}
