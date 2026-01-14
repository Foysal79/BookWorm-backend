import { Response } from "express";
import { UserLibraryService } from "./userLibrary.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

const add = async (req: AuthRequest, res: Response) => {
  try {
    const data = await UserLibraryService.addBook({
      user: req.user!.userId,
      ...req.body,
    });

    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const myLibrary = async (req: AuthRequest, res: Response) => {
  try {
    const data = await UserLibraryService.getMyLibrary(req.user!.userId);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const UserLibraryController = { add, myLibrary };
