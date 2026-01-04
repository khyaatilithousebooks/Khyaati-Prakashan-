export type StockRow = {
  stockNumber: string;
  price: number;
  royaltyPercent: number;
  totalStock: number;
  soldStock: number;
  earnings: number;
  settledAmount: number;
  leftRoyalty: number;
};

export type Book = {
  id: string;
  title: string;
  isbn: string;
  description: string;
  images: string[];
  stock: StockRow[];
};

export type UserRecord = {
  username: string;
  email: string;
  passwordHash: string;
  bio?: string;
  books: Book[];
};
