"use client";

import { useEffect, useState, type FormEvent } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// HYPHEN, tugma sa @Controller("motor-parts") sa backend
const ENDPOINT = "/motor-parts";

type MotorPart = {
  part_id: number;
  motorPart: string;
  price: number;
  brand_id: number;
  supplier_id: number;
};

const emptyForm = { motorPart: "", price: "", brand_id: "", supplier_id: "" };

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-black p-3 outline-none focus:border-red-500";

export default function MotorPartsPage() {
  const [parts, setParts] = useState<MotorPart[]>([]);
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

  async function fetchParts() {
    setLoading(true);
    setError("");
    try {
      const data = await request(ENDPOINT);
      setParts(
        Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load motor parts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchParts();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    const price = Number(form.price);
    const brand_id = Number(form.brand_id);
    const supplier_id = Number(form.supplier_id);

    if (
      !form.motorPart.trim() ||
      form.price.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(brand_id) ||
      brand_id <= 0 ||
      !Number.isInteger(supplier_id) ||
      supplier_id <= 0
    ) {
      setError("Please enter valid information in all fields.");
      return;
    }

    const payload = {
      motorPart: form.motorPart.trim(),
      price,
      brand_id,
      supplier_id,
    };
    setSaving(true);

    try {
      if (editingId !== null) {
        await request(`${ENDPOINT}/${editingId}`, "PUT", payload);
        setMessage("Motor part updated successfully!");
      } else {
        await request(ENDPOINT, "POST", payload);
        setMessage("Motor part added successfully!");
      }
      setForm(emptyForm);
      setEditingId(null);
      await fetchParts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save motor part.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(part: MotorPart) {
    setEditingId(part.part_id);
    setForm({
      motorPart: part.motorPart,
      price: String(part.price),
      brand_id: String(part.brand_id),
      supplier_id: String(part.supplier_id),
    });
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this motor part?")) return;
    setError("");
    setMessage("");
    try {
      await request(`${ENDPOINT}/${id}`, "DELETE");
      setMessage("Motor part deleted successfully!");
      await fetchParts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete motor part.");
    }
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <p className="font-bold tracking-widest text-red-500">
            INVENTORY MANAGEMENT
          </p>
          <h1 className="mt-2 text-4xl font-bold">Motor Parts</h1>
          <p className="mt-2 text-gray-400">
            Add, view, update, and delete motorcycle parts.
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
            {editingId !== null ? "UPDATE MOTOR PART" : "ADD NEW MOTOR PART"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm">Motor Part Name</label>
                <input
                  className={inputClass}
                  value={form.motorPart}
                  onChange={(e) => setForm({ ...form, motorPart: e.target.value })}
                  placeholder="Example: Brake Disc"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Enter price"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Brand ID</label>
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.brand_id}
                  onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                  placeholder="Enter brand ID"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Supplier ID</label>
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.supplier_id}
                  onChange={(e) =>
                    setForm({ ...form, supplier_id: e.target.value })
                  }
                  placeholder="Enter supplier ID"
                  required
                />
              </div>
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
                    ? "UPDATE PART"
                    : "ADD PART"}
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
              <h2 className="text-xl font-bold">Motor Parts Inventory</h2>
              <p className="mt-1 text-sm text-gray-400">
                Total records: {parts.length}
              </p>
            </div>

            <button
              onClick={fetchParts}
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
                  <th className="p-4">Motor Part</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Brand ID</th>
                  <th className="p-4">Supplier ID</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : parts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      No motor parts found.
                    </td>
                  </tr>
                ) : (
                  parts.map((part) => (
                    <tr
                      key={part.part_id}
                      className="border-t border-zinc-800 hover:bg-zinc-800"
                    >
                      <td className="p-4">{part.part_id}</td>
                      <td className="p-4 font-semibold">{part.motorPart}</td>
                      <td className="p-4">
                        ₱
                        {Number(part.price).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-4">{part.brand_id}</td>
                      <td className="p-4">{part.supplier_id}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(part)}
                            className="rounded bg-blue-600 px-3 py-2 text-xs font-bold"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleDelete(part.part_id)}
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