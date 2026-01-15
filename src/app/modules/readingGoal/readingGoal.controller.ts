import { Request, Response } from "express";
import { ReadingGoalService } from "./readingGoal.service";
import { ReadingGoalValidation } from "./readingGoal.validation";

const createReadingGoal = async (req: Request, res: Response) => {
  try {
    const parsed = ReadingGoalValidation.createSchema.parse({ body: req.body });
    const result = await ReadingGoalService.createReadingGoal(parsed.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyGoals = async (req: Request, res: Response) => {
  try {
    const result = await ReadingGoalService.getMyGoals(
      req.params.userId as any
    );
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyActiveGoal = async (req: Request, res: Response) => {
  try {
    const result = await ReadingGoalService.getActiveGoal(
      req.params.userId as any
    );
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyActiveGoalProgress = async (req: Request, res: Response) => {
  try {
    const result = await ReadingGoalService.getActiveGoalProgress(
      req.params.userId as any
    );
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateGoal = async (req: Request, res: Response) => {
  try {
    const parsed = ReadingGoalValidation.updateSchema.parse({ body: req.body });

    const result = await ReadingGoalService.updateGoal(
      req.params.id as any,
      parsed.body
    );
    res.json({ success: true, data: result });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteGoal = async (req: Request, res: Response) => {
  try {
    const result = await ReadingGoalService.deleteGoal(req.params.id as any);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const ReadingGoalController = {
  createReadingGoal,
  getMyGoals,
  getMyActiveGoal,
  getMyActiveGoalProgress,
  updateGoal,
  deleteGoal,
};
