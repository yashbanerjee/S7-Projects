"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { PhoneInput, phoneRequiredSchema } from "@/components/ui/phone-input";
import { siteConfig } from "@/lib/brand";
import { fallbackServices } from "@/lib/content";

const schema = z.object({
  company: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email(),
  phone: phoneRequiredSchema,
  country: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { phone: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setStatus("loading");
    try {
      const body = new FormData();
      Object.entries(data).forEach(([k, v]) => v && body.append(k, v));
      if (file) body.append("file", file);
      const res = await fetch(`${siteConfig.apiUrl}/quotes`, {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error("fail");
      setStatus("success");
      reset({ phone: "" });
      setFile(null);
    } catch {
      setStatus("error");
    }
  });

  return (
    <section className="section-pad bg-white">
      <div className="container-premium max-w-4xl">
        <SectionHeading
          eyebrow="Brief"
          title="Programme details"
          description="Fields marked as required help us triage and assign the right project director immediately."
        />

        <FadeUp delay={0.1}>
          <form onSubmit={onSubmit} className="mt-12 grid gap-6 sm:grid-cols-2">
            <Field label="Company *" error={errors.company?.message}>
              <input className={inputCls} {...register("company")} />
            </Field>
            <Field label="Name *" error={errors.name?.message}>
              <input className={inputCls} {...register("name")} />
            </Field>
            <Field label="Email *" error={errors.email?.message}>
              <input type="email" className={inputCls} {...register("email")} />
            </Field>
            <Field label="Phone *" error={errors.phone?.message}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    required
                  />
                )}
              />
            </Field>
            <Field label="Country">
              <input className={inputCls} {...register("country")} />
            </Field>
            <Field label="Service">
              <select className={inputCls} defaultValue="" {...register("service")}>
                <option value="" disabled>
                  Select service
                </option>
                {fallbackServices.map((s) => (
                  <option key={s.slug} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Budget">
              <select className={inputCls} defaultValue="" {...register("budget")}>
                <option value="" disabled>
                  Select range
                </option>
                <option>Under $50k</option>
                <option>$50k – $150k</option>
                <option>$150k – $500k</option>
                <option>$500k+</option>
                <option>To be discussed</option>
              </select>
            </Field>
            <Field label="Event Date">
              <input type="date" className={inputCls} {...register("eventDate")} />
            </Field>
            <Field label="Location">
              <input className={inputCls} {...register("location")} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Message">
                <textarea rows={5} className={inputCls} {...register("message")} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                File upload (brief, floor plan, brand deck)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-sm text-muted"
              />
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-4 pt-4">
              <Button type="submit" size="lg" disabled={status === "loading"}>
                {status === "loading" ? "Submitting…" : "Submit Enquiry"}
              </Button>
              {status === "success" && (
                <p className="text-sm text-pink">
                  Received. Our team will respond within 24–48 business hours.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-pink">
                  Could not reach the API. Email {siteConfig.email} with your brief.
                </p>
              )}
            </div>
          </form>
        </FadeUp>
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
