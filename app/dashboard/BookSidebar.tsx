"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Book } from "@/lib/types";


export default function BookSidebar({
  books,
  selectedId,
  onSelect,
}: {
  books: Book[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return books;
    return books.filter((b) => b.title.toLowerCase().includes(s));
  }, [q, books]);

  return (
    <aside className="space-y-3">
      <Input
        placeholder="Search..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <ScrollArea className="h-[520px] pr-2">
        <div className="space-y-1">
          {filtered.map((b) => {
            const active = b.id === selectedId;
            return (
              <button
                key={b.id}
                onClick={() => onSelect(b.id)}
                className={cn(
                  "w-full text-left rounded-lg px-3 py-2 text-sm transition border",
                  active
                    ? "bg-muted font-medium border-muted-foreground/40"
                    : "border-transparent hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {b.title}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
