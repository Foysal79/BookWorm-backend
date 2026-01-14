import { Request, Response } from "express";
import mongoose from "mongoose";
import { BookService } from "./book.service";
import { bookValidation } from "./book.validation";

const createBook = async (req: Request, res: Response) => {
  try {
    const { body } = bookValidation.createBookSchema.parse({ body: req.body });

    const book = await BookService.createBook(body);

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Book creation failed",
    });
  }
};

const getAllBooks = async (req: Request, res: Response) => {
  try {
    const result = await BookService.getAllBooks(req.query);

    return res.status(200).json({
      success: true,
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch books",
    });
  }
};

const getSingleBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as any)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book id",
      });
    }

    const book = await BookService.getSingleBookById(id as any);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch book",
    });
  }
};

const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book id",
      });
    }

    const { body } = bookValidation.updateBookSchema.parse({ body: req.body });

    const updated = await BookService.updateBook(id as any, body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book updated",
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Book update failed",
    });
  }
};

const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as any)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book id",
      });
    }

    const deleted = await BookService.softDeleteBook(id as any);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book deleted (soft)",
      data: deleted,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Book delete failed",
    });
  }
};

export const BookController = {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
