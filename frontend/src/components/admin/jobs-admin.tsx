"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Job = {
  id: string;
  title: string;
  slug: string;
  department?: string | null;
  location: string;
  type: string;
  description: string;
  requirements?: string | null;
  benefits?: string | null;
  salary?: string | null;
  active: boolean;
  published: boolean;
};

type FormState = {
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  benefits: string;
  salary: string;
  active: boolean;
  published: boolean;
};

const empty = (): FormState => ({
  title: "",
  slug: "",
  department: "",
  location: "",
  type: "Full-time",
  description: "",
  requirements: "",
  benefits: "",
  salary: "",
  active: true,
  published: true,
});

function slugify(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function JobsAdmin() {
  const [items, setItems] = useState<Job[]>([]);
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
      const res = await adminFetch<{ data: Job[] }>("/jobs?all=true");
      setItems(res.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && mode === "create") next.slug = slugify(String(value));
      return next;
    });
  };

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(empty());
    setMessage("");
  };

  const openEdit = (job: Job) => {
    setMode("edit");
    setEditingId(job.id);
    setForm({
      title: job.title,
      slug: job.slug,
      department: job.department || "",
      location: job.location,
      type: job.type || "Full-time",
      description: job.description,
      requirements: job.requirements || "",
      benefits: job.benefits || "",
      salary: job.salary || "",
      active: job.active,
      published: job.published,
    });
  };

  const save = async () => {
    if (!form.title.trim() || !form.location.trim() || form.description.trim().length < 10) {
      setError("Title, location and description (min 10 chars) are required.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      department: form.department.trim() || undefined,
      location: form.location.trim(),
      type: form.type,
      description: form.description.trim(),
      requirements: form.requirements.trim() || undefined,
      benefits: form.benefits.trim() || undefined,
      salary: form.salary.trim() || undefined,
      active: form.active,
      published: form.published,
    };
    setSaving(true);
    setError("");
    try {
      if (mode === "create") {
        await adminFetch("/jobs", { method: "POST", body: JSON.stringify(payload) });
        setMessage("Job created.");
      } else if (editingId) {
        await adminFetch(`/jobs/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Job updated.");
      }
      setMode("list");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (job: Job) => {
    if (!confirm(`Delete “${job.title}”?`)) return;
    try {
      await adminFetch(`/jobs/${job.id}`, { method: "DELETE" });
      setMessage("Job deleted.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (mode !== "list") {
    return (
      <AdminFormShell
        title={mode === "create" ? "Add job" : "Edit job"}
        onBack={() => setMode("list")}
        error={error}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title *">
            <input className={inputCls} value={form.title} onChange={(e) => setField("title", e.target.value)} />
          </Field>
          <Field label="Slug *">
            <input className={inputCls} value={form.slug} onChange={(e) => setField("slug", e.target.value)} />
          </Field>
          <Field label="Department">
            <input className={inputCls} value={form.department} onChange={(e) => setField("department", e.target.value)} />
          </Field>
          <Field label="Location *">
            <input className={inputCls} value={form.location} onChange={(e) => setField("location", e.target.value)} />
          </Field>
          <Field label="Type">
            <select className={inputCls} value={form.type} onChange={(e) => setField("type", e.target.value)}>
              {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Salary">
            <input className={inputCls} value={form.salary} onChange={(e) => setField("salary", e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description *">
              <textarea rows={4} className={inputCls} value={form.description} onChange={(e) => setField("description", e.target.value)} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Requirements">
              <textarea rows={3} className={inputCls} value={form.requirements} onChange={(e) => setField("requirements", e.target.value)} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Benefits">
              <textarea rows={3} className={inputCls} value={form.benefits} onChange={(e) => setField("benefits", e.target.value)} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setField("active", e.target.checked)} className="accent-[var(--pink)]" />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setField("published", e.target.checked)} className="accent-[var(--pink)]" />
            Published on careers page
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? "Saving…" : mode === "create" ? "Create job" : "Save changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setMode("list")}>
            Cancel
          </Button>
        </div>
      </AdminFormShell>
    );
  }

  return (
    <ListShell
      title="Jobs"
      subtitle="Manage career listings — add, edit, delete."
      onAdd={openCreate}
      addLabel="+ Add job"
      error={error}
      message={message}
    >
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-line bg-soft text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Type</th>
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
            items.map((job) => (
              <tr key={job.id} className="border-b border-line">
                <td className="px-4 py-3 font-medium">{job.title}</td>
                <td className="px-4 py-3">{job.location}</td>
                <td className="px-4 py-3">{job.type}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold uppercase",
                      job.active && job.published ? "bg-pink text-white" : "bg-soft text-muted"
                    )}
                  >
                    {job.active && job.published ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button type="button" className="hover:text-pink hover:underline" onClick={() => openEdit(job)}>
                      Edit
                    </button>
                    <button type="button" className="text-pink hover:underline" onClick={() => remove(job)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          {!loading && !items.length && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-muted">
                No jobs yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </ListShell>
  );
}

/* shared mini UI helpers */
function ListShell({
  title,
  subtitle,
  onAdd,
  addLabel,
  error,
  message,
  children,
}: {
  title: string;
  subtitle: string;
  onAdd: () => void;
  addLabel: string;
  error: string;
  message: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>
        <Button type="button" onClick={onAdd}>
          {addLabel}
        </Button>
      </div>
      {error && (
        <p className="mt-4 rounded border border-pink/30 bg-pink-muted px-4 py-3 text-sm text-pink">{error}</p>
      )}
      {message && !error && (
        <p className="mt-4 rounded border border-line bg-soft px-4 py-3 text-sm">{message}</p>
      )}
      <div className="mt-8 overflow-x-auto border border-line bg-white">{children}</div>
    </div>
  );
}

function AdminFormShell({
  title,
  onBack,
  error,
  children,
}: {
  title: string;
  onBack: () => void;
  error: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl tracking-tight">{title}</h1>
        <button type="button" onClick={onBack} className="text-sm text-muted hover:text-pink">
          ← Back
        </button>
      </div>
      {error && (
        <p className="mt-4 rounded border border-pink/30 bg-pink-muted px-4 py-3 text-sm text-pink">{error}</p>
      )}
      <div className="mt-8 border border-line bg-white p-6">{children}</div>
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
