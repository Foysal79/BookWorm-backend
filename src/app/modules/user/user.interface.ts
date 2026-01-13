export type UserRole = "Admin" | "User";

export type IUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
