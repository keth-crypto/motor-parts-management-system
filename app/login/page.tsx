
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { apiClient } from "@/lib/api";
import { setTokens } from "@/lib/auth";
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

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient<LoginResponse>("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      if (!data.accessToken || !data.refreshToken) {
        throw new Error("Invalid login response.");
      }

      setTokens(data.accessToken, data.refreshToken);
      router.replace(CONFIG.ROUTES.DASHBOARD);

    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4 py-10">

      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/50 via-neutral-950 to-black" />

      <div className="absolute left-0 top-0 h-1 w-full bg-red-600" />

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md space-y-6">

        {/* Branding */}
        <div className="text-center space-y-3">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/40 bg-red-600/10 shadow-lg shadow-red-950">
            <span className="text-3xl font-black italic text-red-500">
              MP
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-wider text-white">
            MOTOR <span className="text-red-500">PARTS</span>
          </h1>

          <p className="text-sm tracking-widest text-neutral-400">
            MANAGEMENT SYSTEM
          </p>

          <div className="mx-auto h-1 w-16 rounded-full bg-red-600" />
        </div>

        {/* Login Card */}
        <Card className="border border-neutral-800 bg-neutral-900/95 text-white shadow-2xl shadow-black/50">

          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              Welcome Back
            </CardTitle>

            <CardDescription className="text-neutral-400">
              Sign in to manage your motorcycle parts.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>

            <CardContent className="space-y-5">

              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-400"
                >
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="text-neutral-200">
                  Username
                </label>

                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                  required
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-red-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-neutral-200">
                  Password
                </label>

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-red-500"
                />
              </div>

            </CardContent>

            <CardFooter className="flex flex-col gap-5">

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 font-bold text-white hover:bg-red-700"
              >
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </Button>

              <p className="text-center text-sm text-neutral-400">
                Don't have an account?{" "}
                <Link
                  href={CONFIG.ROUTES.REGISTER}
                  className="font-semibold text-red-500 hover:text-red-400 hover:underline"
                >
                  Register Now
                </Link>
              </p>

            </CardFooter>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs tracking-wide text-neutral-600">
          © 2026 MOTOR PARTS MANAGEMENT SYSTEM
        </p>

      </div>
    </main>
  );
}
