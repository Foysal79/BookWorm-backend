import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

const selfOrAdmin = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const requestedId = req.params.id;

    const isAdmin = req.user.role === "Admin";
    const isSelf = req.user.userId === requestedId;

    // console.log("TOKEN userId:", req.user?.userId);
    // console.log("PARAM id:", req.params.id);
    // console.log("ROLE:", req.user?.role);

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return next();
  };
};

export const selfOrAdminMiddleware = {
  selfOrAdmin,
};
