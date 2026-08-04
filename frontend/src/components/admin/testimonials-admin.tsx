"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageUrlOrUpload } from "@/components/admin/image-field";

type Testimonial = {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  content: string;
  rating: number;
  avatar?: string | null;
  image?: string | null;
  featured: boolean;
  published: boolean;
  order: number;
};

type FormState = {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: string;
  avatar: string;
  featured: boolean;
  published: boolean;
  order: string;
};

const empty = (): FormState => ({
  name: "",
  role: "",
  company: "",
  content: "",
  rating: "5",
  avatar: "",
  featured: true,
  published: true,
  order: "0",
});

export function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminFetch<{ data: Testimonial[] }>("/content/testimonials?all=true");
      setItems(res.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load testimonials");
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
    setForm(empty());
  };

  const openEdit = (t: Testimonial) => {
    setMode("edit");
    setEditingId(t.id);
    setForm({
      name: t.name,
      role: t.role || "",
      company: t.company || "",
      content: t.content,
      rating: String(t.rating ?? 5),
      avatar: t.avatar || t.image || "",
      featured: t.featured !== false,
      published: t.published !== false,
      order: String(t.order ?? 0),
    });
  };

  const save = async () => {
    if (!form.name.trim() || form.content.trim().length < 10) {
      setError("Name and quote content (min 10 characters) are required.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || undefined,
      company: form.company.trim() || undefined,
      content: form.content.trim(),
      rating: Math.min(5, Math.max(1, Number(form.rating) || 5)),
      avatar: form.avatar.trim() || undefined,
      featured: form.featured,
      published: form.published,
      order: Number(form.order) || 0,
    };
    setSaving(true);
    setError("");
    try {
      if (mode === "create") {
        await adminFetch("/content/testimonials", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Testimonial created.");
      } else if (editingId) {
        await adminFetch(`/content/testimonials/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Testimonial updated.");
      }
      setMode("list");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (t: Testimonial) => {
    if (!confirm(`Delete testimonial from ${t.name}?`)) return;
    try {
      await adminFetch(`/content/testimonials/${t.id}`, { method: "DELETE" });
      setMessage("Testimonial deleted.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (mode !== "list") {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl tracking-tight">
            {mode === "create" ? "Add testimonial" : "Edit testimonial"}
          </h1>
          <button type="button" onClick={() => setMode("list")} className="text-sm text-muted hover:text-pink">
            ← Back
          </button>
        </div>
        {error && (
          <p className="mt-4 rounded border border-pink/30 bg-pink-muted px-4 py-3 text-sm text-pink">{error}</p>
        )}
        <div className="mt-8 grid gap-5 border border-line bg-white p-6 md:grid-cols-2">
          <Field label="Name *">
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </Field>
          <Field label="Role">
            <input
              className={inputCls}
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
          </Field>
          <Field label="Company">
            <input
              className={inputCls}
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            />
          </Field>
          <Field label="Rating (1–5)">
            <input
              type="number"
              min={1}
              max={5}
              className={inputCls}
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Quote *">
              <textarea
                rows={4}
                className={inputCls}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <ImageUrlOrUpload
              label="Avatar / photo"
              folder="testimonials"
              value={form.avatar}
              onChange={(url) => setForm((f) => ({ ...f, avatar: url }))}
            />
          </div>
          <Field label="Order">
            <input
              type="number"
              className={inputCls}
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
            />
          </Field>
          <div className="flex flex-col gap-3 justify-end">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="accent-[var(--pink)]"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="accent-[var(--pink)]"
              />
              Published
            </label>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <Button type="button" onClick={save} disabled={saving}>
              {saving ? "Saving…" : mode === "create" ? "Create testimonial" : "Save changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setMode("list")}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Testimonials</h1>
          <p className="mt-2 text-sm text-muted">Add, edit or delete client testimonials.</p>
        </div>
        <Button type="button" onClick={openCreate}>
          + Add testimonial
        </Button>
      </div>
      {error && (
        <p className="mt-4 rounded border border-pink/30 bg-pink-muted px-4 py-3 text-sm text-pink">{error}</p>
      )}
      {message && !error && (
        <p className="mt-4 rounded border border-line bg-soft px-4 py-3 text-sm">{message}</p>
      )}
      <div className="mt-8 overflow-x-auto border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-soft text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
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
              items.map((t) => (
                <tr key={t.id} className="border-b border-line">
                  <td className="px-4 py-3">
                    <p className="font-medium">{t.name}</p>
                    {t.role && <p className="text-xs text-muted">{t.role}</p>}
                  </td>
                  <td className="px-4 py-3">{t.company || "—"}</td>
                  <td className="px-4 py-3">{t.rating}/5</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold uppercase",
                        t.published ? "bg-pink text-white" : "bg-soft text-muted"
                      )}
                    >
                      {t.published ? "Live" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button type="button" className="hover:text-pink hover:underline" onClick={() => openEdit(t)}>
                        Edit
                      </button>
                      <button type="button" className="text-pink hover:underline" onClick={() => remove(t)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && !items.length && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No testimonials yet.
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
  "w-full border-b border-line bg-transparent py-2.5 text-sm outline-none focus:border-pink";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
