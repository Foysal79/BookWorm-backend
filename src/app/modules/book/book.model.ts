import { Schema, model } from "mongoose";
import { IBook } from "./book.interface";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String },
    coverImageUrl: { type: String },

    genre: { 
        type: Schema.Types.ObjectId, 
        ref: "Genre", 
        required: true },

    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Book = model<IBook>("Book", bookSchema);
