"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/brand";
import { authHeaders } from "@/lib/admin-api";

export default function AdminResourcePage({
  title,
  endpoint,
  columns,
}: {
  title: string;
  endpoint: string;
  columns: { key: string; label: string }[];
}) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState("");

  const load = () => {
    fetch(`${siteConfig.apiUrl}${endpoint}`, { headers: authHeaders() })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.message || "Failed to load");
        setRows(Array.isArray(j.data) ? j.data : []);
      })
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`${siteConfig.apiUrl}${endpoint.split("?")[0]}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted">Managed via REST API · {endpoint}</p>
      {error && (
        <p className="mt-4 rounded border border-pink/30 bg-pink-muted px-4 py-3 text-sm text-pink">
          {error} — ensure the backend is running and you are signed in.
        </p>
      )}
      <div className="mt-8 overflow-x-auto border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-soft text-xs uppercase tracking-wider text-muted">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-semibold">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)} className="border-b border-line last:border-0">
                {columns.map((c) => (
                  <td key={c.key} className="max-w-xs truncate px-4 py-3">
                    {String(row[c.key] ?? "—")}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => remove(String(row.id))}
                    className="text-pink hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && !error && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-muted">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
