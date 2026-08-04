"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PortfolioItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  client?: string | null;
  location?: string | null;
  year?: string | null;
  description: string;
  content?: string | null;
  coverImage: string;
  gallery?: string[];
  tags?: string[];
  featured: boolean;
  published: boolean;
  order?: number;
  metaTitle?: string | null;
  metaDesc?: string | null;
};

type FormState = {
  title: string;
  slug: string;
  category: string;
  client: string;
  location: string;
  year: string;
  description: string;
  content: string;
  coverImage: string;
  tags: string;
  gallery: string;
  featured: boolean;
  published: boolean;
  order: string;
};

const emptyForm = (): FormState => ({
  title: "",
  slug: "",
  category: "Exhibitions",
  client: "",
  location: "",
  year: new Date().getFullYear().toString(),
  description: "",
  content: "",
  coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
  tags: "",
  gallery: "",
  featured: false,
  published: true,
  order: "0",
});

const CATEGORIES = ["Exhibitions", "Events", "Corporate", "Booths"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toForm(item: PortfolioItem): FormState {
  return {
    title: item.title || "",
    slug: item.slug || "",
    category: item.category || "Exhibitions",
    client: item.client || "",
    location: item.location || "",
    year: item.year || "",
    description: item.description || "",
    content: item.content || "",
    coverImage: item.coverImage || "",
    tags: (item.tags || []).join(", "),
    gallery: (item.gallery || []).join("\n"),
    featured: !!item.featured,
    published: item.published !== false,
    order: String(item.order ?? 0),
  };
}

function fromForm(form: FormState) {
  return {
    title: form.title.trim(),
    slug: form.slug.trim() || slugify(form.title),
    category: form.category,
    client: form.client.trim() || undefined,
    location: form.location.trim() || undefined,
    year: form.year.trim() || undefined,
    description: form.description.trim(),
    content: form.content.trim() || undefined,
    coverImage: form.coverImage.trim(),
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    gallery: form.gallery
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean),
    featured: form.featured,
    published: form.published,
    order: Number(form.order) || 0,
  };
}

export function PortfolioAdmin() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await adminFetch<{ data: PortfolioItem[] }>("/portfolio?all=true");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm());
    setMessage("");
  };

  const openEdit = (item: PortfolioItem) => {
    setMode("edit");
    setEditingId(item.id);
    setForm(toForm(item));
    setMessage("");
  };

  const closeForm = () => {
    setMode("list");
    setEditingId(null);
    setForm(emptyForm());
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && mode === "create") {
        next.slug = slugify(String(value));
      }
      return next;
    });
  };

  const save = async () => {
    const payload = fromForm(form);
    if (!payload.title || !payload.description || !payload.coverImage || !payload.slug) {
      setError("Title, slug, description and cover image are required.");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      if (mode === "create") {
        await adminFetch("/portfolio", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Portfolio item created.");
      } else if (editingId) {
        await adminFetch(`/portfolio/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Portfolio item updated.");
      }
      closeForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (item: PortfolioItem) => {
    setError("");
    try {
      await adminFetch(`/portfolio/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ published: !item.published }),
      });
      setItems((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, published: !row.published } : row
        )
      );
      setMessage(
        !item.published
          ? `"${item.title}" is now ON (published).`
          : `"${item.title}" is now OFF (hidden).`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Toggle failed");
    }
  };

  const remove = async (item: PortfolioItem) => {
    if (!confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setError("");
    try {
      await adminFetch(`/portfolio/${item.id}`, { method: "DELETE" });
      setMessage("Item deleted.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (mode === "create" || mode === "edit") {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl tracking-tight">
              {mode === "create" ? "Add portfolio project" : "Edit portfolio project"}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {mode === "create" ? "Create a new case study." : `Editing · ${editingId}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeForm}
            className="text-sm text-muted underline-offset-4 hover:text-pink hover:underline"
          >
            ← Back to list
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded border border-pink/30 bg-pink-muted px-4 py-3 text-sm text-pink">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-5 border border-line bg-white p-6 md:grid-cols-2">
          <Field label="Title *">
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
            />
          </Field>
          <Field label="Slug *">
            <input
              className={inputCls}
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
            />
          </Field>
          <Field label="Category">
            <select
              className={inputCls}
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Client">
            <input
              className={inputCls}
              value={form.client}
              onChange={(e) => setField("client", e.target.value)}
            />
          </Field>
          <Field label="Location">
            <input
              className={inputCls}
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
            />
          </Field>
          <Field label="Year">
            <input
              className={inputCls}
              value={form.year}
              onChange={(e) => setField("year", e.target.value)}
            />
          </Field>
          <Field label="Cover image URL *">
            <input
              className={inputCls}
              value={form.coverImage}
              onChange={(e) => setField("coverImage", e.target.value)}
            />
          </Field>
          <Field label="Order">
            <input
              type="number"
              className={inputCls}
              value={form.order}
              onChange={(e) => setField("order", e.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description *">
              <textarea
                rows={4}
                className={inputCls}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Long content (optional)">
              <textarea
                rows={4}
                className={inputCls}
                value={form.content}
                onChange={(e) => setField("content", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Tags (comma separated)">
            <input
              className={inputCls}
              value={form.tags}
              onChange={(e) => setField("tags", e.target.value)}
              placeholder="Pavilion, Government, Interactive"
            />
          </Field>
          <Field label="Gallery image URLs (one per line)">
            <textarea
              rows={3}
              className={inputCls}
              value={form.gallery}
              onChange={(e) => setField("gallery", e.target.value)}
            />
          </Field>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setField("featured", e.target.checked)}
              className="h-4 w-4 accent-[var(--pink)]"
            />
            Featured on homepage
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setField("published", e.target.checked)}
              className="h-4 w-4 accent-[var(--pink)]"
            />
            Published (visible on public site)
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? "Saving…" : mode === "create" ? "Create project" : "Save changes"}
          </Button>
          <Button type="button" variant="outline" onClick={closeForm}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Portfolio</h1>
          <p className="mt-2 text-sm text-muted">
            Add, edit, publish or hide case studies. Managed via REST API.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          + Add project
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded border border-pink/30 bg-pink-muted px-4 py-3 text-sm text-pink">
          {error}
        </p>
      )}
      {message && !error && (
        <p className="mt-4 rounded border border-line bg-soft px-4 py-3 text-sm text-ink">
          {message}
        </p>
      )}

      <div className="mt-8 overflow-x-auto border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-soft text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Year</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  Loading…
                </td>
              </tr>
            )}
            {!loading &&
              items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="max-w-xs px-4 py-3">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted">{item.slug}</p>
                  </td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">{item.location || "—"}</td>
                  <td className="px-4 py-3">{item.year || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => togglePublished(item)}
                      className={cn(
                        "inline-flex min-w-[72px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition",
                        item.published
                          ? "bg-pink text-white"
                          : "border border-line bg-soft text-muted"
                      )}
                      aria-pressed={item.published}
                      title={item.published ? "Click to turn OFF (hide)" : "Click to turn ON (publish)"}
                    >
                      {item.published ? "ON" : "OFF"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="text-ink hover:text-pink hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item)}
                        className="text-pink hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && !items.length && !error && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No portfolio items yet. Click “Add project” to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputCls =
  "w-full border-b border-line bg-transparent py-2.5 text-sm outline-none transition focus:border-pink";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
