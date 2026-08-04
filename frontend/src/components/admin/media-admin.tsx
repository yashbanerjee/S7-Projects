"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/brand";
import { authHeaders, adminFetch } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, Trash2 } from "lucide-react";

type MediaItem = {
  id: string;
  filename: string;
  url: string;
  type: string;
  mimeType?: string | null;
  size?: number | null;
  folder?: string | null;
  createdAt?: string;
};

function formatBytes(n?: number | null) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaAdmin() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [folder, setFolder] = useState("media");
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminFetch<{ data: MediaItem[] }>("/media");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    setMessage("");
    try {
      let count = 0;
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        body.append("folder", folder || "media");
        const res = await fetch(`${siteConfig.apiUrl}/media`, {
          method: "POST",
          headers: authHeaders(false),
          body,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message || `Failed: ${file.name}`);
        count += 1;
      }
      setMessage(`${count} file(s) uploaded.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async (item: MediaItem) => {
    if (!confirm(`Remove “${item.filename}”?`)) return;
    setError("");
    try {
      await adminFetch(`/media/${item.id}`, { method: "DELETE" });
      setMessage(`Removed ${item.filename}`);
      setItems((prev) => prev.filter((m) => m.id !== item.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("URL copied to clipboard.");
    } catch {
      setMessage(url);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Media Library</h1>
          <p className="mt-2 text-sm text-muted">
            All uploaded files. Upload new assets or remove unused ones.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => void load()}>
          Refresh
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded border border-pink/30 bg-pink-muted px-4 py-3 text-sm text-pink">{error}</p>
      )}
      {message && !error && (
        <p className="mt-4 rounded border border-line bg-soft px-4 py-3 text-sm">{message}</p>
      )}

      <div className="mt-8 border border-line bg-white p-6">
        <div className="flex flex-wrap items-end gap-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Folder
            </span>
            <input
              className="border-b border-line bg-transparent py-2 text-sm outline-none focus:border-pink"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="media"
            />
          </label>
          <label className="block flex-1 min-w-[220px]">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Upload files
            </span>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              disabled={uploading}
              className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-pink file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
              onChange={(e) => void uploadFiles(e.target.files)}
            />
          </label>
          {uploading && (
            <p className="inline-flex items-center gap-2 text-sm text-pink">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </p>
          )}
        </div>
        <p className="mt-3 text-xs text-muted">
          {items.length} file{items.length === 1 ? "" : "s"} in library · Images, video, PDF
        </p>
      </div>

      {loading ? (
        <p className="mt-10 text-center text-muted">Loading media…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 text-center text-muted">No media uploaded yet.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((m) => (
            <article key={m.id} className="border border-line bg-white p-3">
              {m.type === "IMAGE" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.url}
                  alt={m.filename}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-soft text-xs uppercase tracking-wider text-muted">
                  {m.type}
                </div>
              )}
              <p className="mt-3 truncate text-sm font-medium" title={m.filename}>
                {m.filename}
              </p>
              <p className="mt-1 text-xs text-muted">
                {m.folder || "general"} · {formatBytes(m.size)}
              </p>
              <p className="mt-1 truncate text-[11px] text-muted" title={m.url}>
                {m.url}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => void copyUrl(m.url)}
                  className="inline-flex flex-1 items-center justify-center gap-1 border border-line py-2 text-xs uppercase tracking-wider hover:border-pink hover:text-pink"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => void remove(m)}
                  className="inline-flex items-center justify-center gap-1 border border-line px-3 py-2 text-xs text-pink hover:border-pink"
                  aria-label={`Delete ${m.filename}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
