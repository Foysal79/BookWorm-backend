import { Types } from "mongoose";

export type TShelf = "want" | "reading" | "completed";

export interface IUserLibrary {
  user: Types.ObjectId;
  book: Types.ObjectId;
  shelf: TShelf;
  progress: number;
}
