import { Schema, model } from "mongoose";
import { IGenre } from "./genre.interface";

const genreSchema = new Schema<IGenre>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Genre = model<IGenre>("Genre", genreSchema);
