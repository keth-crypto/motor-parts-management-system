"use client";

import { useEffect, useState, type FormEvent } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const ENDPOINT = "/brands";

type Brand = {
  brand_id: number;
  brand_name: string;
};

const emptyForm = {
  brand_name: "",
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function request(path: string, method = "GET", body?: object) {
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken") ||
      "";

    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const msg = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message;
      throw new Error(msg || `API error: ${response.status}`);
    }

    return data;
  }

  async function fetchBrands() {
    setLoading(true);
    setError("");

    try {
      const data = await request(ENDPOINT);
      const records = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];
      setBrands(records);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load brands.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBrands();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.brand_name.trim()) {
      setError("Please enter a brand name.");
      return;
    }

    const payload = {
      brand_name: form.brand_name.trim(),
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await request(`${ENDPOINT}/${editingId}`, "PUT", payload);
        setMessage("Brand updated successfully!");
      } else {
        await request(ENDPOINT, "POST", payload);
        setMessage("Brand added successfully!");
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchBrands();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save brand.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(brand: Brand) {
    setEditingId(brand.brand_id);
    setForm({ brand_name: brand.brand_name });
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    setError("");
    setMessage("");

    try {
      await request(`${ENDPOINT}/${id}`, "DELETE");
      setMessage("Brand deleted successfully!");
      await fetchBrands();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete brand.");
    }
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <p className="font-bold tracking-widest text-red-500">
            INVENTORY MANAGEMENT
          </p>
          <h1 className="mt-2 text-4xl font-bold">Brands</h1>
          <p className="mt-2 text-gray-400">
            Add, view, update, and delete motorcycle part brands.
          </p>
        </div>

        {message && (
          <p className="mb-5 rounded-lg bg-green-950 p-4 text-green-400">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-5 rounded-lg bg-red-950 p-4 text-red-400">{error}</p>
        )}

        <section className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-xl font-bold text-red-500">
            {editingId !== null ? "UPDATE BRAND" : "ADD NEW BRAND"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm">Brand Name</label>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-black p-3 outline-none focus:border-red-500 md:w-1/2"
                value={form.brand_name}
                onChange={(e) => setForm({ brand_name: e.target.value })}
                placeholder="Example: Brembo"
                required
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-red-600 px-6 py-3 font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {saving
                  ? "PLEASE WAIT..."
                  : editingId !== null
                    ? "UPDATE BRAND"
                    : "ADD BRAND"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(emptyForm);
                    setEditingId(null);
                  }}
                  className="rounded-lg bg-zinc-700 px-6 py-3 font-bold"
                >
                  CANCEL
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 p-6">
            <div>
              <h2 className="text-xl font-bold">Brands List</h2>
              <p className="mt-1 text-sm text-gray-400">
                Total records: {brands.length}
              </p>
            </div>

            <button
              onClick={fetchBrands}
              disabled={loading}
              className="rounded-lg border border-red-600 px-5 py-2 text-red-500 hover:bg-red-600 hover:text-white"
            >
              REFRESH
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black text-red-500">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Brand Name</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : brands.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-400">
                      No brands found.
                    </td>
                  </tr>
                ) : (
                  brands.map((brand) => (
                    <tr
                      key={brand.brand_id}
                      className="border-t border-zinc-800 hover:bg-zinc-800"
                    >
                      <td className="p-4">{brand.brand_id}</td>
                      <td className="p-4 font-semibold">{brand.brand_name}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(brand)}
                            className="rounded bg-blue-600 px-3 py-2 text-xs font-bold"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleDelete(brand.brand_id)}
                            className="rounded bg-red-600 px-3 py-2 text-xs font-bold"
                          >
                            DELETE
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}