import { Router } from "express";

const router = Router();
const moduleRouter = [
    {
    path: '/user',
    //route: 
  },
  {
    path: '/admin',
   // route: 
  },
];
moduleRouter.forEach((route) => router.use(route.path, route.route));
export default router;