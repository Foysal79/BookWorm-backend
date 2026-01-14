import mongoose from "mongoose";
import { Tutorial } from "./tutorial.model";

const createTutorial = async (payload: any) => {
  return await Tutorial.create(payload);
};

const getAllTutorials = async () => {
  return await Tutorial.find({ isDeleted: false }).sort({ createdAt: -1 });
};

const updateTutorial = async (id: string, payload: Partial<any>) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("Invalid tutorial id");

  const updated = await Tutorial.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true }
  );

  if (!updated) throw new Error("Tutorial not found or deleted");
  return updated;
};

const deleteTutorial = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("Invalid tutorial id");

  const deleted = await Tutorial.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!deleted) throw new Error("Tutorial not found or already deleted");
  return deleted;
};

export const TutorialService = {
  createTutorial,
  getAllTutorials,
  updateTutorial,
  deleteTutorial,
};
