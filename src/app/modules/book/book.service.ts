import { Book } from "./book.model";

const createBook = async (payload: any) => {
  try {
    const existingBook = await Book.findOne({
      title: { $regex: `^${payload.title}$`, $options: "i" },
    });

    if (existingBook) {
      throw new Error("Book title already exists");
    }
    const book = await Book.create(payload);
    return book;
  } catch (error) {
    throw error;
  }
};

const getAllBooks = async (query: any) => {
  try {
    const filter: any = { isDeleted: false };

    if (query.genre) {
      filter.genre = query.genre;
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: "i" } },
        { author: { $regex: query.search, $options: "i" } },
      ];
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Book.find(filter)
        .populate("genre")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Book.countDocuments(filter),
    ]);

    return {
      meta: { page, limit, total },
      data,
    };
  } catch (error) {
    throw error;
  }
};

const getSingleBookById = async (id: string) => {
  try {
    return await Book.findOne({ _id: id, isDeleted: false }).populate("genre");
  } catch (error) {
    throw error;
  }
};

const updateBook = async (id: string, payload: any) => {
  try {
    return await Book.findOneAndUpdate({ _id: id, isDeleted: false }, payload, {
      new: true,
      runValidators: true,
    }).populate("genre");
  } catch (error) {
    throw error;
  }
};

const softDeleteBook = async (id: string) => {
  try {
    return await Book.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

export const BookService = {
  createBook,
  getAllBooks,
  getSingleBookById,
  updateBook,
  softDeleteBook,
};
