import { Request, Response } from "express";
import { UserService } from "./user.service";
import bcrypt from "bcrypt";
import config from "../../config";
import { userValidation } from "./user.validation";
import { AuthRequest } from "../../middlewares/auth.middleware";
import mongoose, { Types } from "mongoose";
// user registration
const registerUser = async (req: Request, res: Response) => {
  try {
    const { body } = userValidation.registerSchema.parse({ body: req.body });

    const hashed = await bcrypt.hash(
      body.password,
      Number(config.bcrypt_salt_rounds)
    );

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
    return res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
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
    return res
      .status(400)
      .json({ success: false, message: error.message || "Login failed" });
  }
};

//admin only (all user get)
const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// get single ( admin and own email )
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserService.getSingleUser(id as any);
    return res.status(201).json({
      success: true,
      message: "get all User successfully",
      data: user,
    });
  } catch (error: any) {
    return res
      .status(404)
      .json({ success: false, message: error?.message || "User not found" });
  }
};


const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id as any)) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }
  const { body } = userValidation.updateRoleSchema.parse({ body: req.body });
  const updated = await UserService.updateUserRole(id as any, body.role);
  if (!updated) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res.status(200).json({
    success: true,
    message: "User role updated",
    data: updated,
  });
};


//* soft delete (isDeleted = true)
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as any)) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }

  const deleted = await UserService.softDeleteUser(id as any);

  if (!deleted) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    message: "User deleted (soft)",
    data: deleted,
  });
};

export const UserController = {
  registerUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser
};
