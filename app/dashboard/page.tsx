"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StockTable from "@/components/dashboard/StockTable";
import type { Book } from "@/lib/types";
import BookDetailsCard from "./BookDetailsCard";
import BookImagesCard from "./BookImagesCard";
import BookSidebar from "./BookSidebar";

type ProfileResponse = {
  username: string;
  email: string;
  bio?: string;
  books: Book[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [userInitial, setUserInitial] = useState("?");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/user/profile")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data: ProfileResponse | null) => {
        if (!data || !active) return;
        setBooks(data.books ?? []);
        setSelectedId((data.books?.[0]?.id as string | undefined) ?? "");
        setUserName(data.username ?? "");
        setUserEmail(data.email ?? "");
        setUserInitial(
          (data.username ?? data.email ?? "?").slice(0, 1).toUpperCase()
        );
      })
      .catch(() => {
        if (active) setBooks([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  const selectedBook = useMemo(() => {
    if (!books.length) return undefined;
    return books.find((b) => b.id === selectedId) ?? books[0];
  }, [selectedId, books]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-muted/40 p-6 text-sm text-muted-foreground">
          Loading your books...
        </div>
      </div>
    );
  }

  if (!books.length || !selectedBook) {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-muted/40 p-6 text-sm text-muted-foreground">
          No books available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <div>
            <div className="text-xl font-semibold">Khyaati Prakashan</div>
            <p className="text-sm text-muted-foreground">Your Books</p>
          </div>
          <BookSidebar
            books={books}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="space-y-6">
          <div className="flex justify-end">
            <a
              href="/settings"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-sm font-medium transition hover:bg-muted/70"
              aria-label="Account settings"
            >
              {userInitial}
            </a>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <BookDetailsCard book={selectedBook} />
            <BookImagesCard images={selectedBook.images} />
          </div>

          <StockTable
            rows={selectedBook.stock}
            userName={userName}
            userEmail={userEmail}
          />
        </div>
      </div>
    </div>
  );
}
