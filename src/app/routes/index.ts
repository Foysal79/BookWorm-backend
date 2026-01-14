import { Router } from "express";
import { UserRoutes } from "../modules/user/user.router";
import { BookRoutes } from "../modules/book/book.router";
import { GenreRoutes } from "../modules/genre/genre.router";

const router = Router();
const moduleRouter = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/book",
    route: BookRoutes,
  },

  {
    path: "/genre",
    route: GenreRoutes,
  },
];
moduleRouter.forEach((route) => router.use(route.path, route.route));
export default router;
