"use client";

import { useRef, useState } from "react";
import { siteConfig } from "@/lib/brand";
import { authHeaders } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { ImagePlus, Link2, Loader2, X } from "lucide-react";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  required?: boolean;
  preview?: boolean;
};

export function ImageUrlOrUpload({
  label,
  value,
  onChange,
  folder = "portfolio",
  required,
  preview = true,
}: Props) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      const res = await fetch(`${siteConfig.apiUrl}/media`, {
        method: "POST",
        headers: authHeaders(false),
        body,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Upload failed");
      if (!json.data?.url) throw new Error("No URL returned from upload");
      onChange(json.data.url as string);
      setMode("url");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {label}
          {required ? " *" : ""}
        </span>
        <div className="inline-flex rounded-full border border-line p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 transition",
              mode === "url" ? "bg-pink text-white" : "text-muted hover:text-ink"
            )}
          >
            <Link2 className="h-3.5 w-3.5" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 transition",
              mode === "upload" ? "bg-pink text-white" : "text-muted hover:text-ink"
            )}
          >
            <ImagePlus className="h-3.5 w-3.5" />
            Upload
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <input
          className="w-full border-b border-line bg-transparent py-2.5 text-sm outline-none transition focus:border-pink"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or paste image link"
        />
      ) : (
        <div className="rounded border border-dashed border-line bg-soft p-4">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-pink file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-pink-soft"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadFile(file);
            }}
          />
          <p className="mt-2 text-xs text-muted">
            JPG, PNG, WEBP or GIF. Uploaded files are stored via the media API.
          </p>
          {uploading && (
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-pink">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </p>
          )}
        </div>
      )}

      {error && <p className="text-xs text-pink">{error}</p>}

      {preview && value && (
        <div className="relative mt-1 inline-block overflow-hidden border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-28 w-44 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-white hover:bg-pink"
            aria-label="Clear image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

type GalleryProps = {
  label: string;
  urls: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
};

export function GalleryUrlOrUpload({
  label,
  urls,
  onChange,
  folder = "portfolio",
}: GalleryProps) {
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    if (urls.includes(u)) {
      setError("This URL is already in the gallery.");
      return;
    }
    onChange([...urls, u]);
    setUrlInput("");
    setError("");
  };

  const removeAt = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        body.append("folder", folder);
        const res = await fetch(`${siteConfig.apiUrl}/media`, {
          method: "POST",
          headers: authHeaders(false),
          body,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message || `Upload failed: ${file.name}`);
        if (json.data?.url) uploaded.push(json.data.url as string);
      }
      onChange([...urls, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 md:col-span-2">
      <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-line p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink">
            Add by URL
          </p>
          <div className="flex gap-2">
            <input
              className="w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-pink"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
            />
            <button
              type="button"
              onClick={addUrl}
              className="shrink-0 rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-pink"
            >
              Add
            </button>
          </div>
        </div>

        <div className="border border-dashed border-line bg-soft p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink">
            Upload images
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            disabled={uploading}
            className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-pink file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
            onChange={(e) => void uploadFiles(e.target.files)}
          />
          {uploading && (
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-pink">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-pink">{error}</p>}

      {urls.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {urls.map((url, i) => (
            <div key={`${url}-${i}`} className="relative border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Gallery ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-white hover:bg-pink"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No gallery images yet — paste a URL or upload files.</p>
      )}
    </div>
  );
}
