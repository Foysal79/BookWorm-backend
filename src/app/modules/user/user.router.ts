import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

export const UserRoutes = router;
