import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { StockRow } from "@/lib/types";
import { useMemo, useState } from "react";

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "--";
  const pct = value > 0 && value <= 1 ? value * 100 : value;
  return `${pct}%`;
}

function CellInput({ value }: { value: string }) {
  return (
    <Input
      readOnly
      value={value}
      className="h-9 bg-background text-sm"
      aria-label={value}
    />
  );
}

type Props = {
  rows: StockRow[];
  userName?: string;
  userEmail?: string;
};

export default function StockTable({ rows, userEmail, userName }: Props) {
  const [showSettle, setShowSettle] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const leftRoyaltyTotal = useMemo(
    () =>
      rows.reduce(
        (acc, r) => acc + (Number.isFinite(r.leftRoyalty) ? r.leftRoyalty : 0),
        0
      ),
    [rows]
  );

  async function requestPayout() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userName || "Unknown user",
          email: userEmail || "Unknown email",
          amount: leftRoyaltyTotal,
        }),
      });

      if (!res.ok) {
        throw new Error(`Payout request failed with ${res.status}`);
      }

      alert("Payout request submitted. It may take 2-4 days to reflect.");
      setSubmitted(true);
    } catch {
      alert("Could not submit payout request. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Stock</CardTitle>
        <p className="text-sm text-muted-foreground">
          Current inventory levels of your products.
        </p>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">Stock Number</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground">Royalty</TableHead>
                <TableHead className="text-muted-foreground">Total Stock</TableHead>
                <TableHead className="text-muted-foreground">Sold Stock</TableHead>
                <TableHead className="text-muted-foreground">Earnings</TableHead>
                <TableHead className="text-muted-foreground">Settled Amt.</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.stockNumber} className="border-b">
                  <TableCell className="font-medium">
                    <CellInput value={r.stockNumber} />
                  </TableCell>
                  <TableCell>
                    <CellInput value={formatINR(r.price)} />
                  </TableCell>
                  <TableCell>
                    <CellInput value={formatPercent(r.royaltyPercent)} />
                  </TableCell>
                  <TableCell>
                    <CellInput value={String(r.totalStock)} />
                  </TableCell>
                  <TableCell>
                    <CellInput value={String(r.soldStock)} />
                  </TableCell>
                  <TableCell>
                    <CellInput value={formatINR(r.earnings)} />
                  </TableCell>
                  <TableCell>
                    <CellInput value={formatINR(r.settledAmount)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-center">
          {!submitted && (
            <Button
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
              disabled={submitting}
              onClick={async () => {
                setShowSettle((prev) => !prev);
                await requestPayout();
              }}
            >
              {showSettle
                ? `Settle Amount ${formatINR(leftRoyaltyTotal)}`
                : "Generate Balance"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
