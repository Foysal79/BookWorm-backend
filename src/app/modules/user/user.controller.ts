import { Request, Response } from "express";
import { UserService } from "./user.service";
import bcrypt from "bcrypt";
import config from "../../config";
import { userValidation } from "./user.validation";
const registerUser = async (req: Request, res: Response) => {
  try {
    const parsed = userValidation.registerSchema.parse({body : req.body});
    const userData = parsed.body;
    if (userData.password) {
      userData.password = await bcrypt.hash(
        userData.password,
        Number(config.bcrypt_salt_rounds)
      );
    }
    const user = await UserService.createUser(userData as any);
    const userSafe = user.toObject() as any;
    delete userSafe.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userSafe,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

export const UserController = {
  registerUser,
};
