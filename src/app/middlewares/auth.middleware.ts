import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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
        process.env.JWT_SECRET as string
      ) as jwt.JwtPayload;

      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        email: decoded.email,
      };

      return next();
    } catch {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
};

export const authMiddleware = {
  auth,
};
