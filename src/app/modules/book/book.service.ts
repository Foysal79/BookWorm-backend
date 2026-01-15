import QueryBuilder from "../../utils/QueryBuilder";
import { BookSearchableFields } from "./book.constant";
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

const getAllBooks = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  // data query
  const baseQuery = Book.find({ isDeleted: false }).populate("genre");
  const qb = new QueryBuilder(baseQuery, query)
    .search(BookSearchableFields)
    .filter()
    .sort()
    .pagination()
    .fields();

  const data = await qb.modelQuery;

  // count query (same filters, no populate needed)
  const total = await Book.countDocuments({
    isDeleted: false,
    ...qb.getFilterQuery(),
  });

  return {
    meta: { page, limit, total },
    data,
  };
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
