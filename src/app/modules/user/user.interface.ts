import { Types } from "mongoose";

export type UserRole = "Admin" | "User";

export type IUser = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TRegisterPayload = Pick<IUser, "name" | "email" | "password"> & {
  photoUrl?: string;
};

export type TLoginPayload = {
  email: string;
  password: string;
};
