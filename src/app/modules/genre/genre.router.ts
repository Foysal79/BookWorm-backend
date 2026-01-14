import { Router } from "express";
import { GenreController } from "./genre.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleBaseMiddleware } from "../../middlewares/role.middleware";


const router = Router();
// get all genre ( all user )
router.get("/", authMiddleware.auth(), GenreController.getAll);
// create admin ( admin )
router.post("/", authMiddleware.auth(),
roleBaseMiddleware.requireRole("Admin"),
 GenreController.create);
 // update ( admin )
router.patch("/:id", authMiddleware.auth(), 
roleBaseMiddleware.requireRole("Admin"),
 GenreController.update);
 // delate ( admin )
router.delete("/:id", authMiddleware.auth(),
 roleBaseMiddleware.requireRole("Admin"),
  GenreController.remove);

export const GenreRoutes = router;
