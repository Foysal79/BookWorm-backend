import { Router } from "express";
import { UserController } from "./user.controller";
import { selfOrAdminMiddleware } from "../../middlewares/selfOrAdmin.middleware";
import { selfOrAdminMiddleware } from "./../../middlewares/selfOrAdmin.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleBaseMiddleware } from "../../middlewares/role.middleware";

const router = Router();
// public
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

// privet
router.get(
  "/",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("Admin"),
  UserController.getAllUsers
);

router.get("/:id", authMiddleware.auth(), selfOrAdminMiddleware.selfOrAdmin());

router.patch(
  "/:id",
  authMiddleware.auth(),
  selfOrAdminMiddleware.selfOrAdmin()
);

router.delete(
  "/:id",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("Admin")
);

export const UserRoutes = router;
