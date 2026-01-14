import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { BookController } from "./book.controller";
import { roleBaseMiddleware } from "../../middlewares/role.middleware";

const router = Router();

// public (but authenticated)
router.get("/", authMiddleware.auth(), BookController.getAllBooks);
router.get("/:id", authMiddleware.auth(), BookController.getSingleBook);

// admin only
// create book only admin
router.post("/", authMiddleware.auth(), 
roleBaseMiddleware.requireRole("Admin"), 
BookController.createBook);
// update book
router.patch("/:id", authMiddleware.auth(), 
roleBaseMiddleware.requireRole("Admin"), 
BookController.updateBook);
// softy delate
router.delete("/:id", authMiddleware.auth(),
 roleBaseMiddleware.requireRole("Admin"), 
 BookController.deleteBook);

export const BookRoutes = router;
