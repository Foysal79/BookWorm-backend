import { ReadingGoal } from "./readingGoal.model";
import { UserLibrary } from "../userLibrary/userLibrary.model";
import { IReadingGoalProgress } from "./readingGoal.interface";

const createReadingGoal = async (payload: any) => {
  try {
    // one active goal per user
    await ReadingGoal.updateMany(
      { user: payload.user, isActive: true, isDeleted: false },
      { isActive: false }
    );

    return await ReadingGoal.create(payload);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getMyGoals = async (userId: string) => {
  try {
    return await ReadingGoal.find({
      user: userId,
      isDeleted: false,
    }).sort({ createdAt: -1 });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getActiveGoal = async (userId: string) => {
  try {
    return await ReadingGoal.findOne({
      user: userId,
      isActive: true,
      isDeleted: false,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getActiveGoalProgress = async (
  userId: string
): Promise<IReadingGoalProgress | null> => {
  try {
    const goal = await getActiveGoal(userId);
    if (!goal) return null;

    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);

    const completedBooks = await UserLibrary.countDocuments({
      user: userId,
      shelf: "completed",
      updatedAt: { $gte: start, $lte: end },
    });

    const remaining = Math.max(0, goal.targetBook - completedBooks);
    const percentage =
      goal.targetBook > 0
        ? Math.min(100, Math.round((completedBooks / goal.targetBook) * 100))
        : 0;

    return {
      goal: goal.toObject() as any,
      completedBooks,
      remaining,
      percentage,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const updateGoal = async (id: string, payload: any) => {
  try {
    return await ReadingGoal.findOneAndUpdate(
      { _id: id, isDeleted: false },
      payload,
      { new: true }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const deleteGoal = async (id: string) => {
  try {
    return await ReadingGoal.findByIdAndUpdate(
      id,
      { isDeleted: true, isActive: false },
      { new: true }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const ReadingGoalService = {
  createReadingGoal,
  getMyGoals,
  getActiveGoal,
  getActiveGoalProgress,
  updateGoal,
  deleteGoal,
};
