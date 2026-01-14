import { Genre } from "./genre.model";

const createGenre = async (name: string) => {
    // console.log("name : ", name);
  try {
    const exists = await Genre.findOne({ name, isDeleted: false });
    // console.log("exists : ", exists);
    if (!exists) {
      const genre = await Genre.create({ name });
      return genre;
    }
    else{
      throw new Error("Genre already exists");
    }
    
  } catch (error) {
    throw error;
  }
};

const getAllGenres = async () => {
  try {
    return await Genre.find({ isDeleted: false }).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

const updateGenre = async (id: string, name: string) => {
  try {
    return await Genre.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { name },
      { new: true, runValidators: true }
    );
  } catch (error) {
    throw error;
  }
};

const deleteGenre = async (id: string) => {
  try {
    return await Genre.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

export const GenreService = {
  createGenre,
  getAllGenres,
  updateGenre,
  deleteGenre,
};
