import { Router } from "express";
import { ReviewController } from "./review.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleBaseMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.post("/", authMiddleware.auth(), ReviewController.create);

router.get("/book/:bookId", authMiddleware.auth(), ReviewController.getByBook);

router.patch(
  "/:id/approve",
  authMiddleware.auth(),
  roleBaseMiddleware.requireRole("Admin"),
  ReviewController.approve
);

export const ReviewRoutes = router;
