"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/brand";
import { authHeaders } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";

type Media = { id: string; filename: string; url: string; type: string };

export default function MediaPage() {
  const [items, setItems] = useState<Media[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

  const load = () => {
    fetch(`${siteConfig.apiUrl}/media`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((j) => setItems(j.data || []))
      .catch(() => setMsg("Unable to load media. Is the API running?"));
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "media");
    const res = await fetch(`${siteConfig.apiUrl}/media`, {
      method: "POST",
      headers: authHeaders(false),
      body,
    });
    if (!res.ok) {
      setMsg("Upload failed");
      return;
    }
    setFile(null);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Media Library</h1>
      <div className="mt-8 flex flex-wrap items-end gap-4 border border-line bg-white p-6">
        <input type="file" accept="image/*,video/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <Button type="button" onClick={upload} disabled={!file}>
          Upload
        </Button>
        {msg && <p className="text-sm text-pink">{msg}</p>}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((m) => (
          <div key={m.id} className="border border-line bg-white p-3">
            {m.type === "IMAGE" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.url} alt={m.filename} className="aspect-square w-full object-cover" />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-soft text-xs text-muted">
                {m.type}
              </div>
            )}
            <p className="mt-2 truncate text-xs text-muted">{m.filename}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
