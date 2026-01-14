import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email: string;
  };
}

const auth = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization;

      if (!header || !header.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const token = header.split(" ")[1];

      const decoded = jwt.verify(
        token,
        config.JWT_SECRET as string
      ) as jwt.JwtPayload;

      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        email: decoded.email,
      };
  // console.log("ROLE FROM TOKEN:", req.user.role);
      return next();
    } catch {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
};

export const authMiddleware = {
  auth,
};
