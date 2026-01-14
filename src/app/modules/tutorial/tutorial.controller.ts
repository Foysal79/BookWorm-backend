import { Request, Response } from "express";
import { TutorialService } from "./tutorial.service";

const create = async (req: Request, res: Response) => {
  try {
    const tutorial = await TutorialService.createTutorial(req.body);
    res.status(201).json({ success: true, data: tutorial });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const tutorials = await TutorialService.getAllTutorials();
    res.status(200).json({ success: true, data: tutorials });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const updated = await TutorialService.updateTutorial(
      req.params.id as any,
      req.body
    );
    res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const deleted = await TutorialService.deleteTutorial(req.params.id as any);
    res.status(200).json({ success: true, data: deleted });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const TutorialController = { 
    create, 
    getAll, 
    update, 
    remove 
};
