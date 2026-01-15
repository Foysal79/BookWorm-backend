import { Types } from "mongoose";

export type GoalPeriod = "weekly" | "monthly" | "yearly";

export type IReadingGoal = {
    user : Types.ObjectId;
    period : GoalPeriod;

    targetBook : number;

    startDate : Date;
    endDate : Date;

    isActive : boolean;
    isDeleted : boolean;
}

export type IReadingGoalProgress = {
    goal : IReadingGoal;
    completedBooks : number;
    remaining : number;
    percentage : number;
}
