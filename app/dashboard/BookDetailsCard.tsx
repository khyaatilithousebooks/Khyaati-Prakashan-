import type { Book } from "@/lib/mock/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function BookDetailsCard({ book }: { book: Book }) {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Book Details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Detailed information about your products.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={book.title} readOnly />
        </div>

        <div className="space-y-2">
          <Label>ISBN</Label>
          <Input value={book.isbn} readOnly />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <textarea
            value={book.description}
            readOnly
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}
