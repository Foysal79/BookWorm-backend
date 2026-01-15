import { IReadingGoal } from "./readingGoal.interface";
import { ReadingGoal } from "./readingGoal.model";

const createReadingGoal = async (payload: IReadingGoal) => {
  try {
    // check any Ruining goal active
    await ReadingGoal.updateMany(
      { user: payload.user, isActive: true, isDeleted: false },
      { isActive: false }
    );
    const user = await ReadingGoal.create(payload);
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getMyGoals = async (userId: string) => {
  try {
    const goal = await ReadingGoal.find({
      user: userId,
      isDeleted: false,
    }).sort({ createdAt: -1 });
    return goal;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getActiveGoal = async (userId: string) => {
  try {
    const goal = await ReadingGoal.findOne({
      user: userId,
      isActive: true,
      isDeleted: false,
    });
    return goal;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const ReadingGoalService = {
  createReadingGoal,
  getMyGoals,
};
