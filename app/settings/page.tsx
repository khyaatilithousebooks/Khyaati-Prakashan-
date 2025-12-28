"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Profile = {
  username: string;
  email: string;
  bio: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    username: "",
    email: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      .then((data) => {
        if (!data || !active) return;
        setProfile({
          username: data.username ?? "",
          email: data.email ?? "",
          bio: data.bio ?? "",
        });
      })
      .catch(() => {
        if (active) setError("Unable to load profile.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Unable to save profile.");
        return;
      }
      setSuccess("Profile updated.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function onLogout() {
    setError("");
    setSuccess("");
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) {
        setError("Unable to log out. Please try again.");
        return;
      }
      router.push("/login");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-sm text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Settings</div>
          <p className="text-sm text-muted-foreground">
            Manage your profile information.
          </p>
        </div>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-sm font-medium"
          aria-label="Profile avatar"
        >
          {profile.username?.slice(0, 1).toUpperCase() || "?"}
        </button>
      </header>

      <form
        onSubmit={onSubmit}
        className="grid gap-6 rounded-lg border bg-background p-6"
      >
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={profile.username}
            readOnly
            aria-readonly="true"
            className="cursor-not-allowed bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Contact support to change your username.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            readOnly
            aria-readonly="true"
            className="cursor-not-allowed bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Contact support to change your email.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio / Notes</Label>
          <textarea
            id="bio"
            value={profile.bio}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, bio: e.target.value }))
            }
            rows={4}
            placeholder="Add a short note"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {error && (
          <div className="text-sm text-destructive" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-emerald-600" role="status">
            {success}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onLogout}
            disabled={loggingOut || saving}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
          <Button type="submit" disabled={saving || loggingOut}>
            {saving ? "Saving..." : "Update profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
