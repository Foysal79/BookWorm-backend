import { UserLibrary } from "./userLibrary.model";

const addBook = async (payload: any) => {
  try {
    return await UserLibrary.create(payload);
  } catch (err) {
    throw err;
  }
};

const getMyLibrary = async (userId: string) => {
  try {
    return await UserLibrary.find({ user: userId }).populate("book");
  } catch (err) {
    throw err;
  }
};

export const UserLibraryService = { 
    addBook, 
    getMyLibrary 
};
