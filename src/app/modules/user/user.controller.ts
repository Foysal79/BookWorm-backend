import { Request, Response } from "express";
import { UserService } from "./user.service";
import bcrypt from "bcrypt";
import config from "../../config";
import { userValidation } from "./user.validation";
// user registration
const registerUser = async (req: Request, res: Response) => {
  try {
    const { body } = userValidation.registerSchema.parse({ body: req.body });

    const hashed = await bcrypt.hash(body.password, Number(config.bcrypt_salt_rounds));

    const user = await UserService.createUser({
      ...body,
      password: hashed,
      role: "User",
      isVerified: false,
    } as any);

    const safe = user.toObject();
    delete (safe as any).password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: safe,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || "Registration failed" });
  }
};


// user login
const loginUser = async (req: Request, res: Response) => {
  try {
    const { body } = userValidation.loginSchema.parse({ body: req.body });
    const data = await UserService.loginUser(body);
    return res.status(200).json({
      success: true,
      message: "Login success",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || "Login failed" });
  }
};



export const UserController = {
  registerUser,
  loginUser
};
