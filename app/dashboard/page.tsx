
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { clearTokens } from "@/lib/auth";
import { CONFIG } from "@/lib/config";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const hasToken = ["accessToken", "access_token", "token", "authToken"].some(
      (key) => Boolean(window.localStorage.getItem(key)),
    );

    if (!hasToken) {
      router.replace(CONFIG.ROUTES.LOGIN);
      return;
    }

    setIsChecking(false);
  }, [router]);

  const handleLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    clearTokens();
    router.replace(CONFIG.ROUTES.LOGIN);
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        Verifying session...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">

      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-neutral-800 bg-neutral-900 p-6 md:flex">

        <div className="mb-10">
          <h1 className="text-2xl font-black tracking-wide">
            MOTOR <span className="text-red-500">PARTS</span>
          </h1>
          <p className="mt-1 text-xs tracking-widest text-neutral-500">
            MANAGEMENT SYSTEM
          </p>
        </div>

        <nav className="flex-1 space-y-3">

          <Link
            href={CONFIG.ROUTES.DASHBOARD}
            className="flex items-center gap-3 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white"
          >
            <span>▦</span>
            Dashboard
          </Link>

          <Link
            href="/motor-parts"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            <span>⚙</span>
            Motor Parts
          </Link>

          <Link
            href="/brands"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            <span>◈</span>
            Brands
          </Link>

          <Link
            href="/suppliers"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            <span>♙</span>
            Suppliers
          </Link>

        </nav>

        <div className="border-t border-neutral-800 pt-5">
          <Button
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-6 md:p-10">

        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-red-500">
              Overview
            </p>

            <h2 className="text-3xl font-bold">
              Dashboard
            </h2>

            <p className="mt-2 text-neutral-400">
              Welcome to your Motor Parts Management System.
            </p>
          </div>

          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 md:hidden"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>

          <div className="hidden rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-green-400 sm:block">
            ● System Online
          </div>

        </header>

        {/* Welcome Card */}
        <Card className="mb-8 overflow-hidden border-neutral-800 bg-neutral-900 text-white">

          <CardContent className="relative p-8">

            <div className="absolute right-0 top-0 h-full w-2 bg-red-600" />

            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-500">
              Motor Parts Management
            </p>

            <h3 className="text-2xl font-bold">
              Welcome Back!
            </h3>

            <p className="mt-3 max-w-xl text-neutral-400">
              You are successfully authenticated.
              Manage your motorcycle parts, brands, and suppliers
              using your management dashboard.
            </p>

          </CardContent>
        </Card>

        {/* Dashboard Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <Card className="border-neutral-800 bg-neutral-900 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-400">
                Motor Parts
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-red-500">
                Inventory
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Manage motorcycle parts
              </p>
              <Link
                href="/motor-parts"
                className="mt-4 inline-block text-sm text-red-400 hover:underline"
              >
                View Motor Parts →
              </Link>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-400">
                Brands
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-red-500">
                Management
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Manage motorcycle brands
              </p>
              <Link
                href="/brands"
                className="mt-4 inline-block text-sm text-red-400 hover:underline"
              >
                View Brands →
              </Link>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-400">
                Suppliers
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-red-500">
                Management
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Manage your suppliers
              </p>
              <Link
                href="/suppliers"
                className="mt-4 inline-block text-sm text-red-400 hover:underline"
              >
                View Suppliers →
              </Link>
            </CardContent>
          </Card>

        </div>

        {/* Quick Information */}
        <Card className="border-neutral-800 bg-neutral-900 text-white">
          <CardHeader>
            <CardTitle className="text-lg">
              System Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-neutral-400">
            <p>
              <span className="text-white">Application:</span>{" "}
              Motor Parts Management System
            </p>

            <p>
              <span className="text-white">Authentication:</span>{" "}
              JWT Authentication
            </p>

            <p>
              <span className="text-white">Session:</span>{" "}
              <span className="text-green-400">Authenticated</span>
            </p>
          </CardContent>
        </Card>

        <footer className="mt-10 border-t border-neutral-800 pt-5 text-center text-xs text-neutral-600">
          © 2026 Motor Parts Management System. All rights reserved.
        </footer>

      </main>
    </div>
  );
}
