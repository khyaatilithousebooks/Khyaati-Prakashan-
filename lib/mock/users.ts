import { userWorkbooks } from "@/lib/mock/data";

export type MockUser = {
  username: string;
  email: string;
  passwordHash: string;
};

// Derive users from generated workbooks; fallback empty array
export const mockUsers: MockUser[] = userWorkbooks.map((u) => ({
  username: u.username,
  email: u.email,
  passwordHash: u.passwordHash,
}));
