"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";

type Dash = {
  stats: Record<string, number>;
  recentQuotes: { id: string; company: string; name: string; createdAt: string }[];
  recentMessages: { id: string; name: string; subject?: string; createdAt: string }[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<Dash | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<{ data: Dash }>("/content/dashboard")
      .then((j) => setData(j.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load dashboard"));
  }, []);

  const stats = data?.stats || {
    portfolio: 0,
    services: 0,
    quotes: 0,
    messages: 0,
    jobs: 0,
    applications: 0,
    media: 0,
    faqs: 0,
  };

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Dashboard</h1>
      <p className="mt-2 text-muted">Overview of Project S7 website content and enquiries.</p>
      {error && (
        <p className="mt-4 rounded border border-pink/30 bg-pink-muted px-4 py-3 text-sm text-pink">
          {error}
        </p>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="border border-line bg-white p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{key}</p>
            <p className="font-display mt-3 text-3xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="border border-line bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">Recent quotes</h2>
            <Link href="/admin/quotes" className="text-sm text-pink">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {(data?.recentQuotes || []).map((q) => (
              <li key={q.id} className="py-3 text-sm">
                <p className="font-medium">{q.company}</p>
                <p className="text-muted">
                  {q.name} · {new Date(q.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
            {!data?.recentQuotes?.length && (
              <li className="py-6 text-sm text-muted">No quotes yet.</li>
            )}
          </ul>
        </div>
        <div className="border border-line bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">Recent messages</h2>
            <Link href="/admin/messages" className="text-sm text-pink">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {(data?.recentMessages || []).map((m) => (
              <li key={m.id} className="py-3 text-sm">
                <p className="font-medium">{m.name}</p>
                <p className="text-muted">
                  {m.subject || "No subject"} · {new Date(m.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
            {!data?.recentMessages?.length && (
              <li className="py-6 text-sm text-muted">No contact messages yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
