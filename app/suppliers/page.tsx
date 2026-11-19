"use client";

import { useEffect, useState, type FormEvent } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const ENDPOINT = "/suppliers";

type Supplier = {
  supplier_id: number;
  supplier_name: string;
  contact_number: string;
  address: string;
};

const emptyForm = {
  supplier_name: "",
  contact_number: "",
  address: "",
};

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-black p-3 outline-none focus:border-red-500";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
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

  async function fetchSuppliers() {
    setLoading(true);
    setError("");

    try {
      const data = await request(ENDPOINT);
      const records = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];
      setSuppliers(records);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load suppliers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.supplier_name.trim()) {
      setError("Please enter a supplier name.");
      return;
    }

    const payload = {
      supplier_name: form.supplier_name.trim(),
      contact_number: form.contact_number.trim(),
      address: form.address.trim(),
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await request(`${ENDPOINT}/${editingId}`, "PUT", payload);
        setMessage("Supplier updated successfully!");
      } else {
        await request(ENDPOINT, "POST", payload);
        setMessage("Supplier added successfully!");
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save supplier.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(supplier: Supplier) {
    setEditingId(supplier.supplier_id);
    setForm({
      supplier_name: supplier.supplier_name,
      contact_number: supplier.contact_number || "",
      address: supplier.address || "",
    });
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;

    setError("");
    setMessage("");

    try {
      await request(`${ENDPOINT}/${id}`, "DELETE");
      setMessage("Supplier deleted successfully!");
      await fetchSuppliers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete supplier."
      );
    }
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <p className="font-bold tracking-widest text-red-500">
            INVENTORY MANAGEMENT
          </p>
          <h1 className="mt-2 text-4xl font-bold">Suppliers</h1>
          <p className="mt-2 text-gray-400">
            Add, view, update, and delete motorcycle part suppliers.
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
            {editingId !== null ? "UPDATE SUPPLIER" : "ADD NEW SUPPLIER"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm">Supplier Name</label>
                <input
                  className={inputClass}
                  value={form.supplier_name}
                  onChange={(e) =>
                    setForm({ ...form, supplier_name: e.target.value })
                  }
                  placeholder="Example: MotoSupply Co."
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Contact Number</label>
                <input
                  className={inputClass}
                  value={form.contact_number}
                  onChange={(e) =>
                    setForm({ ...form, contact_number: e.target.value })
                  }
                  placeholder="0912 345 6789"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Address</label>
                <input
                  className={inputClass}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Enter address"
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
                    ? "UPDATE SUPPLIER"
                    : "ADD SUPPLIER"}
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
              <h2 className="text-xl font-bold">Suppliers List</h2>
              <p className="mt-1 text-sm text-gray-400">
                Total records: {suppliers.length}
              </p>
            </div>

            <button
              onClick={fetchSuppliers}
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
                  <th className="p-4">Supplier Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      No suppliers found.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr
                      key={supplier.supplier_id}
                      className="border-t border-zinc-800 hover:bg-zinc-800"
                    >
                      <td className="p-4">{supplier.supplier_id}</td>
                      <td className="p-4 font-semibold">
                        {supplier.supplier_name}
                      </td>
                      <td className="p-4">{supplier.contact_number}</td>
                      <td className="p-4">{supplier.address}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(supplier)}
                            className="rounded bg-blue-600 px-3 py-2 text-xs font-bold"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleDelete(supplier.supplier_id)}
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