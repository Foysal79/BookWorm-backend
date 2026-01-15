import { Request, Response } from "express";
import mongoose from "mongoose";
import { GenreService } from "./genre.service";
import { genreValidation } from "./genre.validation";

const create = async (req: Request, res: Response) => {
  try {
    const { body } = genreValidation.createGenreSchema.parse({ body: req.body });
    
    const genre = await GenreService.createGenre(body.name);
    return res.status(201).json({
      success: true,
      message: "Genre created",
      data: genre,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Genre creation failed",
    });
  }
};

const getAll = async (_req: Request, res: Response) => {
  try {
    const genres = await GenreService.getAllGenres();

    return res.status(200).json({
      success: true,
      data: genres,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch genres",
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as any)) {
      return res.status(400).json({
        success: false,
        message: "Invalid genre id",
      });
    }

    const { body } = genreValidation.updateGenreSchema.parse({ body: req.body });

    const updated = await GenreService.updateGenre(id as any, body.name);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Genre not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Genre updated",
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Genre update failed",
    });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as any)) {
      return res.status(400).json({
        success: false,
        message: "Invalid genre id",
      });
    }

    const deleted = await GenreService.deleteGenre(id as any);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Genre not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Genre deleted (soft)",
      data: deleted,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Genre delete failed",
    });
  }
};

export const GenreController = {
  create,
  getAll,
  update,
  remove,
};
