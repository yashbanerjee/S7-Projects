"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/brand";
import type { fallbackJobs } from "@/lib/content";
import { cn } from "@/lib/utils";

type Job = (typeof fallbackJobs)[number];

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  cover: z.string().min(20, "Please share a short cover note"),
  portfolio: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CareersClient({ jobs }: { jobs: Job[] }) {
  const [selected, setSelected] = useState(jobs[0]?.slug || "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resume, setResume] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const job = jobs.find((j) => j.slug === selected) || jobs[0];

  const onSubmit = handleSubmit(async (data) => {
    if (!job) return;
    setStatus("loading");
    try {
      const body = new FormData();
      Object.entries(data).forEach(([k, v]) => v && body.append(k, v));
      if (resume) body.append("resume", resume);
      const res = await fetch(`${siteConfig.apiUrl}/jobs/${job.slug}/apply`, {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
      setResume(null);
    } catch {
      setStatus("error");
    }
  });

  return (
    <section className="section-pad bg-white" id="apply">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Open roles"
          title="Current opportunities"
          description="Select a role to review requirements and apply. Applications are reviewed by our people team."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-3">
            {jobs.map((j) => (
              <button
                key={j.slug}
                type="button"
                onClick={() => setSelected(j.slug)}
                className={cn(
                  "w-full border px-5 py-5 text-left transition",
                  selected === j.slug
                    ? "border-pink bg-pink-muted"
                    : "border-line hover:border-pink/40"
                )}
              >
                <p className="font-display text-xl tracking-tight">{j.title}</p>
                <p className="mt-2 text-sm text-muted">
                  {j.department} · {j.location} · {j.type}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7">
            {job && (
              <FadeUp>
                <h3 className="font-display text-3xl tracking-tight">{job.title}</h3>
                <p className="mt-4 text-muted leading-relaxed">{job.description}</p>
                {job.requirements && (
                  <div className="mt-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">Requirements</p>
                    <p className="mt-3 text-muted leading-relaxed">{job.requirements}</p>
                  </div>
                )}
                {job.benefits && (
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">Benefits</p>
                    <p className="mt-3 text-muted leading-relaxed">{job.benefits}</p>
                  </div>
                )}

                <form onSubmit={onSubmit} className="mt-10 grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name?.message}>
                    <input className={inputCls} {...register("name")} />
                  </Field>
                  <Field label="Email" error={errors.email?.message}>
                    <input type="email" className={inputCls} {...register("email")} />
                  </Field>
                  <Field label="Phone">
                    <input className={inputCls} {...register("phone")} />
                  </Field>
                  <Field label="Portfolio URL">
                    <input className={inputCls} {...register("portfolio")} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Cover note" error={errors.cover?.message}>
                      <textarea rows={4} className={inputCls} {...register("cover")} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      Resume (PDF)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                      className="text-sm text-muted"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-4">
                    <Button type="submit" disabled={status === "loading"}>
                      {status === "loading" ? "Submitting…" : "Submit Application"}
                    </Button>
                    {status === "success" && (
                      <p className="text-sm text-pink">Application received. Thank you.</p>
                    )}
                    {status === "error" && (
                      <p className="text-sm text-pink">
                        Could not reach API. Please email {siteConfig.email}
                      </p>
                    )}
                  </div>
                </form>
              </FadeUp>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full border-b border-line bg-transparent py-3 text-sm outline-none transition focus:border-pink";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-pink">{error}</span>}
    </label>
  );
}
