import { Schema, model } from "mongoose";
import { IUserLibrary } from "./userLibrary.interface";

const schema = new Schema<IUserLibrary>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    book: { type: Schema.Types.ObjectId, ref: "Book" },
    shelf: {
      type: String,
      enum: ["want", "reading", "completed"],
      default: "want",
    },
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const UserLibrary = model<IUserLibrary>("UserLibrary", schema);
