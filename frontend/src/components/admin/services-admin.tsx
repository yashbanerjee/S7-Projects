"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GalleryUrlOrUpload, ImageUrlOrUpload } from "@/components/admin/image-field";

export type ServiceItem = {
  id: string;
  title: string;
  slug: string;
  tagline?: string | null;
  description: string;
  overview?: string | null;
  content?: string | null;
  image?: string | null;
  gallery?: string[];
  icon?: string | null;
  order?: number;
  featured: boolean;
  published: boolean;
  benefits?: string[] | null;
  features?: string[] | null;
};

type FormState = {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  overview: string;
  content: string;
  image: string;
  gallery: string[];
  icon: string;
  order: string;
  featured: boolean;
  published: boolean;
  benefits: string;
  features: string;
};

const emptyForm = (): FormState => ({
  title: "",
  slug: "",
  tagline: "",
  description: "",
  overview: "",
  content: "",
  image: "",
  gallery: [],
  icon: "",
  order: "0",
  featured: false,
  published: true,
  benefits: "",
  features: "",
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function arrayToLines(value: unknown): string {
  if (!value) return "";
  if (Array.isArray(value)) return value.map(String).join("\n");
  return "";
}

function toForm(item: ServiceItem): FormState {
  return {
    title: item.title || "",
    slug: item.slug || "",
    tagline: item.tagline || "",
    description: item.description || "",
    overview: item.overview || "",
    content: item.content || "",
    image: item.image || "",
    gallery: item.gallery || [],
    icon: item.icon || "",
    order: String(item.order ?? 0),
    featured: !!item.featured,
    published: item.published !== false,
    benefits: arrayToLines(item.benefits),
    features: arrayToLines(item.features),
  };
}

function fromForm(form: FormState) {
  return {
    title: form.title.trim(),
    slug: form.slug.trim() || slugify(form.title),
    tagline: form.tagline.trim() || undefined,
    description: form.description.trim(),
    overview: form.overview.trim() || undefined,
    content: form.content.trim() || undefined,
    image: form.image.trim() || undefined,
    gallery: form.gallery.map((u) => u.trim()).filter(Boolean),
    icon: form.icon.trim() || undefined,
    order: Number(form.order) || 0,
    featured: form.featured,
    published: form.published,
    benefits: linesToArray(form.benefits),
    features: linesToArray(form.features),
  };
}

export function ServicesAdmin() {
  const [items, setItems] = useState<ServiceItem[]>([]);
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
      const res = await adminFetch<{ data: ServiceItem[] }>("/services?all=true");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load services");
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

  const openEdit = (item: ServiceItem) => {
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
    if (!payload.title || !payload.slug || !payload.description || payload.description.length < 10) {
      setError("Title, slug and description (min 10 characters) are required.");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      if (mode === "create") {
        await adminFetch("/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Service created.");
      } else if (editingId) {
        await adminFetch(`/services/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Service updated.");
      }
      closeForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item: ServiceItem) => {
    setError("");
    try {
      await adminFetch(`/services/${item.id}`, {
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
          ? `"${item.title}" is now Active.`
          : `"${item.title}" is now Inactive.`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Toggle failed");
    }
  };

  const remove = async (item: ServiceItem) => {
    if (!confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setError("");
    try {
      await adminFetch(`/services/${item.id}`, { method: "DELETE" });
      setMessage("Service deleted.");
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
              {mode === "create" ? "Add service" : "Edit service"}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {mode === "create"
                ? "Create a new service offering."
                : `Editing · ${editingId}`}
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
          <Field label="Tagline">
            <input
              className={inputCls}
              value={form.tagline}
              onChange={(e) => setField("tagline", e.target.value)}
            />
          </Field>
          <Field label="Icon name (optional)">
            <input
              className={inputCls}
              value={form.icon}
              onChange={(e) => setField("icon", e.target.value)}
              placeholder="Layers, PenTool, Users…"
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
            <ImageUrlOrUpload
              label="Service image"
              folder="services"
              value={form.image}
              onChange={(url) => setField("image", url)}
            />
          </div>
          <div className="md:col-span-2">
            <Field label="Description * (min 10 characters)">
              <textarea
                rows={4}
                className={inputCls}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Overview">
              <textarea
                rows={3}
                className={inputCls}
                value={form.overview}
                onChange={(e) => setField("overview", e.target.value)}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Long content (optional)">
              <textarea
                rows={3}
                className={inputCls}
                value={form.content}
                onChange={(e) => setField("content", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Benefits (one per line)">
            <textarea
              rows={4}
              className={inputCls}
              value={form.benefits}
              onChange={(e) => setField("benefits", e.target.value)}
            />
          </Field>
          <Field label="Features (one per line)">
            <textarea
              rows={4}
              className={inputCls}
              value={form.features}
              onChange={(e) => setField("features", e.target.value)}
            />
          </Field>
          <GalleryUrlOrUpload
            label="Gallery images"
            folder="services"
            urls={form.gallery}
            onChange={(urls) => setField("gallery", urls)}
          />
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setField("featured", e.target.checked)}
              className="h-4 w-4 accent-[var(--pink)]"
            />
            Featured
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setField("published", e.target.checked)}
              className="h-4 w-4 accent-[var(--pink)]"
            />
            Active (visible on public site)
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? "Saving…" : mode === "create" ? "Create service" : "Save changes"}
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
          <h1 className="font-display text-3xl tracking-tight">Services</h1>
          <p className="mt-2 text-sm text-muted">
            Add, edit, activate or deactivate services. Managed via REST API.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          + Add service
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
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Featured</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Loading…
                </td>
              </tr>
            )}
            {!loading &&
              items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="max-w-xs px-4 py-3">
                    <p className="font-medium">{item.title}</p>
                    {item.tagline && (
                      <p className="text-xs text-muted">{item.tagline}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{item.slug}</td>
                  <td className="px-4 py-3">{item.featured ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(item)}
                      className={cn(
                        "inline-flex min-w-[88px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition",
                        item.published
                          ? "bg-pink text-white"
                          : "border border-line bg-soft text-muted"
                      )}
                      aria-pressed={item.published}
                      title={
                        item.published
                          ? "Click to set Inactive (hide on site)"
                          : "Click to set Active (show on site)"
                      }
                    >
                      {item.published ? "Active" : "Inactive"}
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
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No services yet. Click “Add service” to create one.
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
