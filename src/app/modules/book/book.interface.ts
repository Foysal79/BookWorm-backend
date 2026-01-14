import { Types } from "mongoose";

export type IBook = {
  title: string;
  author: string;
  genre: Types.ObjectId;
  description: string;
  coverImageUrl: string;
  ratingAvg: number;
  ratingCount: number;
  isDeleted: boolean;
};
