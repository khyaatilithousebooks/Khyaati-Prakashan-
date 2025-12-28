"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthResponse = {
  user: { username: string; email: string } | null;
  isAdmin?: boolean;
};

export default function AdminUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then(async (res) => {
        if (!active) return null;
        if (res.status === 401) {
          router.replace("/login");
          return null;
        }
        return res.json();
      })
      .then((data: AuthResponse | null) => {
        if (!active || !data) return;
        if (!data.user) {
          router.replace("/login");
          return;
        }
        if (!data.isAdmin) {
          router.replace("/dashboard");
          return;
        }
        setChecking(false);
      })
      .catch(() => {
        if (active) router.replace("/login");
      });

    return () => {
      active = false;
    };
  }, [router]);

  async function handleUpload() {
    if (!file) {
      setStatus("Please select an Excel file first.");
      return;
    }

    setStatus("Uploading and syncing...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(data?.error ?? "Upload failed.");
        return;
      }

      setStatus("Users synced successfully.");
    } catch (error) {
      setStatus("Upload failed. Please try again.");
      console.error(error);
    }
  }

  if (checking) {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-muted/40 p-6 text-sm text-muted-foreground">
          Checking admin access...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Admin Excel Upload</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload the latest users Excel workbook to sync data.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <div className="flex items-center gap-3">
            <Button onClick={handleUpload} disabled={!file}>
              Upload & Sync
            </Button>
            {status && <p className="text-sm text-muted-foreground">{status}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
