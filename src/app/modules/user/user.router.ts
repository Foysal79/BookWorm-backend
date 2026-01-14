import { Router } from "express";
import { UserController } from "./user.controller";
import { selfOrAdminMiddleware } from "../../middlewares/selfOrAdmin.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleBaseMiddleware } from "../../middlewares/role.middleware";

const router = Router();
// public
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

// privet
// get all user only admin
router.get(
  "/",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("Admin"),
  UserController.getAllUsers
);
// get single user
router.get(
  "/:id",
  authMiddleware.auth(),
  selfOrAdminMiddleware.selfOrAdmin(),
  UserController.getSingleUser
);

router.patch(
  "/:id",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("Admin"),
  UserController.updateUserRole
);

router.delete(
  "/:id",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("Admin"),
  UserController.deleteUser
);

export const UserRoutes = router;
