"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
};

type FormState = {
  question: string;
  answer: string;
  category: string;
  order: string;
  published: boolean;
};

const empty = (): FormState => ({
  question: "",
  answer: "",
  category: "General",
  order: "0",
  published: true,
});

export function FaqsAdmin() {
  const [items, setItems] = useState<FAQ[]>([]);
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
      const res = await adminFetch<{ data: FAQ[] }>("/content/faqs?all=true");
      setItems(res.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load FAQs");
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

  const openEdit = (faq: FAQ) => {
    setMode("edit");
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "General",
      order: String(faq.order ?? 0),
      published: faq.published !== false,
    });
  };

  const save = async () => {
    if (!form.question.trim() || form.answer.trim().length < 5) {
      setError("Question and answer are required.");
      return;
    }
    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim() || "General",
      order: Number(form.order) || 0,
      published: form.published,
    };
    setSaving(true);
    setError("");
    try {
      if (mode === "create") {
        await adminFetch("/content/faqs", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("FAQ created.");
      } else if (editingId) {
        await adminFetch(`/content/faqs/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("FAQ updated.");
      }
      setMode("list");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (faq: FAQ) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await adminFetch(`/content/faqs/${faq.id}`, { method: "DELETE" });
      setMessage("FAQ deleted.");
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
            {mode === "create" ? "Add FAQ" : "Edit FAQ"}
          </h1>
          <button type="button" onClick={() => setMode("list")} className="text-sm text-muted hover:text-pink">
            ← Back
          </button>
        </div>
        {error && (
          <p className="mt-4 rounded border border-pink/30 bg-pink-muted px-4 py-3 text-sm text-pink">{error}</p>
        )}
        <div className="mt-8 space-y-5 border border-line bg-white p-6">
          <Field label="Question *">
            <input
              className={inputCls}
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            />
          </Field>
          <Field label="Answer *">
            <textarea
              rows={5}
              className={inputCls}
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Category">
              <input
                className={inputCls}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </Field>
            <Field label="Order">
              <input
                type="number"
                className={inputCls}
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="accent-[var(--pink)]"
            />
            Published
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={save} disabled={saving}>
              {saving ? "Saving…" : mode === "create" ? "Create FAQ" : "Save changes"}
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
          <h1 className="font-display text-3xl tracking-tight">FAQ</h1>
          <p className="mt-2 text-sm text-muted">Add, edit or delete frequently asked questions.</p>
        </div>
        <Button type="button" onClick={openCreate}>
          + Add FAQ
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
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted">
                  Loading…
                </td>
              </tr>
            )}
            {!loading &&
              items.map((faq) => (
                <tr key={faq.id} className="border-b border-line">
                  <td className="max-w-md px-4 py-3">
                    <p className="font-medium">{faq.question}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{faq.answer}</p>
                  </td>
                  <td className="px-4 py-3">{faq.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold uppercase",
                        faq.published ? "bg-pink text-white" : "bg-soft text-muted"
                      )}
                    >
                      {faq.published ? "Live" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button type="button" className="hover:text-pink hover:underline" onClick={() => openEdit(faq)}>
                        Edit
                      </button>
                      <button type="button" className="text-pink hover:underline" onClick={() => remove(faq)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && !items.length && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted">
                  No FAQs yet.
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
