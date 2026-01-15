import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleBaseMiddleware } from "../../middlewares/role.middleware";
import { ReadingGoalController } from "./readingGoal.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { ReadingGoalValidation } from "./readingGoal.validation";

const router = Router();

//  Admin + User
router.get(
  "/user/:userId",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("Admin", "User"),
  ReadingGoalController.getMyGoals
);

router.get(
  "/active/:userId",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("Admin", "User"),
  ReadingGoalController.getMyActiveGoal
);

router.get(
  "/active/:userId/progress",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("Admin", "User"),
  ReadingGoalController.getMyActiveGoalProgress
);

//  Only User
router.post(
  "/",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("User"),
  validateRequest(ReadingGoalValidation.createSchema),
  ReadingGoalController.createReadingGoal
);

router.patch(
  "/:id",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("User"),
  validateRequest(ReadingGoalValidation.updateSchema),
  ReadingGoalController.updateGoal
);

router.delete(
  "/:id",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("User"),
  ReadingGoalController.deleteGoal
);

export const ReadingGoalRoutes = router;
