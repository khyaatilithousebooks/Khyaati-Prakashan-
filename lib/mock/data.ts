import type {
  GeneratedBook,
  GeneratedStockRow,
  GeneratedUser,
} from "./generated-users";
import { generatedUsers } from "./generated-users";

export type StockRow = GeneratedStockRow;
export type Book = GeneratedBook;
export type UserWorkbook = GeneratedUser;

export const userWorkbooks: UserWorkbook[] = generatedUsers;
