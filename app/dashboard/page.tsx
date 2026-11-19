"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearTokens } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();

  function handleLogout() {
    clearTokens();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* SIDEBAR */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900 p-6">

        <div className="mb-12">
          <h1 className="text-2xl font-bold">
            MOTOR <span className="text-red-500">PARTS</span>
          </h1>
          <p className="mt-1 text-xs tracking-widest text-gray-500">
            MANAGEMENT SYSTEM
          </p>
        </div>

        <nav className="flex-1 space-y-4">
          <Link
            href="/dashboard"
            className="block rounded-lg bg-red-600 px-4 py-3 font-bold hover:bg-red-700"
          >
            ▦ Dashboard
          </Link>

          <Link
            href="/motor-parts"
            className="block rounded-lg px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            ⚙ Motor Parts
          </Link>

          <Link
            href="/brands"
            className="block rounded-lg px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            ◇ Brands
          </Link>

          <Link
            href="/suppliers"
            className="block rounded-lg px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            ♙ Suppliers
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 rounded-lg border border-red-600 px-4 py-3 font-bold text-red-500 hover:bg-red-600 hover:text-white"
        >
          LOG OUT
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 p-6 md:p-10">

        {/* HEADER */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <p className="font-bold tracking-widest text-red-500">
              OVERVIEW
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              Dashboard
            </h2>

            <p className="mt-3 text-gray-400">
              Welcome to your Motor Parts Management System.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-green-400">
            ● System Online
          </div>
        </header>

        {/* WELCOME CARD */}
        <section className="mb-8 rounded-2xl border-r-8 border-red-600 bg-zinc-900 p-8">
          <p className="font-bold tracking-widest text-red-500">
            MOTOR PARTS MANAGEMENT
          </p>

          <h2 className="mt-4 text-3xl font-bold">
            Welcome Back!
          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
            You are successfully authenticated. Manage your motorcycle
            parts, brands, and suppliers using your management dashboard.
          </p>
        </section>

        {/* MANAGEMENT CARDS */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-gray-400">Motor Parts</p>

            <h3 className="mt-5 text-3xl font-bold text-red-500">
              Inventory
            </h3>

            <p className="mt-3 text-gray-400">
              Manage motorcycle parts.
            </p>

            <Link
              href="/motor-parts"
              className="mt-6 inline-block font-bold text-red-500 hover:text-red-400"
            >
              View Motor Parts →
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-gray-400">Brands</p>

            <h3 className="mt-5 text-3xl font-bold text-red-500">
              Management
            </h3>

            <p className="mt-3 text-gray-400">
              Manage motorcycle brands.
            </p>

            <Link
              href="/brands"
              className="mt-6 inline-block font-bold text-red-500 hover:text-red-400"
            >
              View Brands →
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-gray-400">Suppliers</p>

            <h3 className="mt-5 text-3xl font-bold text-red-500">
              Management
            </h3>

            <p className="mt-3 text-gray-400">
              Manage your suppliers.
            </p>

            <Link
              href="/suppliers"
              className="mt-6 inline-block font-bold text-red-500 hover:text-red-400"
            >
              View Suppliers →
            </Link>
          </div>

        </section>

        {/* SYSTEM INFORMATION */}
        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="text-xl font-bold">
            System Information
          </h3>

          <div className="mt-5 space-y-3 text-gray-400">
            <p>
              <span className="font-bold text-white">Application:</span>{" "}
              Motor Parts Management System
            </p>

            <p>
              <span className="font-bold text-white">Frontend:</span>{" "}
              Next.js
            </p>

            <p>
              <span className="font-bold text-white">Backend:</span>{" "}
              NestJS
            </p>

            <p>
              <span className="font-bold text-white">Database:</span>{" "}
              MySQL
            </p>

            <p>
              <span className="font-bold text-white">Operations:</span>{" "}
              GET, POST, PUT, DELETE
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}