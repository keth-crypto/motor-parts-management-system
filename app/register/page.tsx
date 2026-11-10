
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { apiClient } from "@/lib/api";
import { CONFIG } from "@/lib/config";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setError("Please enter your username and password.");
      return;
    }

    if (trimmedUsername.length < 3) {
      setError("Username must contain at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await apiClient("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password,
        }),
      });

      router.replace(CONFIG.ROUTES.LOGIN);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">

        {/* Header */}
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">
            Create Account
          </CardTitle>

          <CardDescription>
            Register a new account to get started.
          </CardDescription>
        </CardHeader>

        {/* Registration Form */}
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">

            {error && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
              >
                {error}
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium leading-none">
                Username
              </label>

              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                minLength={3}
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>

              <Input
                id="password"
                type="password"
                placeholder="Create your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                disabled={loading}
                required
              />
            </div>

          </CardContent>

          {/* Footer */}
          <CardFooter className="flex flex-col gap-4">

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={CONFIG.ROUTES.LOGIN}
                className="font-medium text-primary underline"
              >
                Login
              </Link>
            </p>

          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
