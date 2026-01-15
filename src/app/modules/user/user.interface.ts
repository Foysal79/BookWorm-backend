import { Types } from "mongoose";

export type TRole = "Admin" | "User";

export type IUser = {
  name: string;
  img: string;
  email: string;
  password: string;
  role?: TRole;
  isVerified: boolean;
  isDeleted: boolean;
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
