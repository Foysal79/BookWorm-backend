import { Router } from "express";
import { TutorialController } from "./tutorial.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleBaseMiddleware } from "../../middlewares/role.middleware";

const router = Router();
// add
router.post(
  "/",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("Admin"),
  TutorialController.create
);
// get ( all user )
router.get("/", 
    authMiddleware.auth(), 
TutorialController.getAll);

// Admin only edit
router.patch(
  "/:id",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("Admin"),
  TutorialController.update
);

// Admin only delete (soft delete)
router.delete(
  "/:id",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("Admin"),
  TutorialController.remove
);

export const TutorialRoutes = router;
