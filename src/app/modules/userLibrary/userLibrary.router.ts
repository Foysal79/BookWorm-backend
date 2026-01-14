import { Router } from "express";
import { UserLibraryController } from "./userLibrary.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware.auth(), UserLibraryController.add);
router.get("/me", authMiddleware.auth(), UserLibraryController.myLibrary);

export const UserLibraryRoutes = router;
