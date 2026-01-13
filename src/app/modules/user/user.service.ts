import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: IUser) => {
  try {
    const user = await User.create(payload);
    return user;
  } catch (error) {
    throw error;
  }
};

export const UserService = {
  createUser,
};
