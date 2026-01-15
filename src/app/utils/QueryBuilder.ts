// QueryBuilder.ts
import { Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  private filterQuery: Record<string, any> = {}; 

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm as string;

    if (searchTerm) {
      const searchQuery = {
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      };

      this.filterQuery = { ...this.filterQuery, ...searchQuery };
      this.modelQuery = this.modelQuery.find(searchQuery);
    }

    return this;
  }

  filter() {
    const queryObject = { ...this.query };
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete (queryObject as any)[el]);

    this.filterQuery = { ...this.filterQuery, ...(queryObject as any) };
    this.modelQuery = this.modelQuery.find(queryObject as any);

    return this;
  }

  sort() {
    const sort =
      (this.query.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  pagination() {
    const limit = Number(this.query.limit) || 10;
    const page = Number(this.query.page) || 1;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields =
      (this.query.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // ✅ for countDocuments
  getFilterQuery() {
    return this.filterQuery;
  }
}

export default QueryBuilder;
