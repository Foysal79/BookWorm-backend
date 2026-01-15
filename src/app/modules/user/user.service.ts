import { IUser, TLoginPayload, TRegisterPayload, TRole } from "./user.interface";
import { User } from "./user.model";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import config from "../../config";

//* create new user
const createUser = async (payload: TRegisterPayload) => {
  try {
    const exists = await User.findOne({ email: payload.email });
    if (exists) throw new Error("Email already exists");

    const user = await User.create(payload);
    return user;
  } catch (error) {
    throw error;
  }
};

//* login user
const loginUser = async (payload: TLoginPayload) => {
  try {
    const user = await User.findOne({ email: payload.email }).select(
      "+password"
    );
    if (!user) throw new Error("Invalid credentials");

    const ok = await bcrypt.compare(payload.password, user.password);
    if (!ok) throw new Error("Invalid password");

    const token = jwt.sign(
      {
        userId: String(user._id),
        role: user.role,
        email: user.email,
      },
      config.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    // password hide
    const safeUser = await User.findById(user._id);
    return { user: safeUser, token };
  } catch (error) {
    throw error;
  }
};

//* get all user
const getAllUsers = async () => {
  try {
    const user = User.find({ isDeleted: false }).sort({ createdAt: -1 });
    return user;
  } catch (error) {
    throw error;
  }
};

//* get Single User
const getSingleUser = async (id: string) => {
  const user = await User.findById(id);
  return user;
};

//* only role update
const updateUserRole = async (id: string, role: TRole) => {
  try {
    const user = User.findOneAndUpdate(
      { _id: id, isDeleted: false }, 
      { role },
      { new: true, runValidators: true }
    );
    return user;
  } catch (error) {
    throw error;
  }
};

//* soft delete only
const softDeleteUser = async (id: string) => {
  return User.findOneAndUpdate(
    { _id: id, isDeleted: false }, 
    { isDeleted: true },
    { new: true }
  );
};

export const UserService = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  softDeleteUser,
};
