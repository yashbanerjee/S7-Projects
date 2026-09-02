"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { PhoneInput, phoneRequiredSchema } from "@/components/ui/phone-input";
import { siteConfig } from "@/lib/brand";
import { approvedServices } from "@/lib/brief-content";

const schema = z.object({
  company: z.string().min(2, "Company is required"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: phoneRequiredSchema,
  service: z.string().optional(),
  projectType: z.string().optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const projectTypes = [
  "Exhibition",
  "Conference",
  "Corporate Event",
  "Exhibition Stand",
  "Multi-Service Programme",
  "Other",
];

type QuoteIntent = "design" | "quote" | "consultation";

export function QuoteForm({ intent = "quote" }: { intent?: QuoteIntent }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [file, setFile] = useState<File | null>(null);

  const isDesign = intent === "design";
  const heading = isDesign ? "Start designing your stand" : "Request a quote";
  const description = isDesign
    ? "Share your brand, space, and objectives — our design team will respond with creative direction."
    : "Tell us about your event or exhibition project. We respond with clarity and a structured proposal.";
  const submitLabel = isDesign ? "Start Designing" : "Get a Quote";

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      service: isDesign ? "Exhibition Stand Design" : "",
    },
  });

  useEffect(() => {
    if (isDesign) setValue("service", "Exhibition Stand Design");
  }, [isDesign, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setStatus("loading");
    try {
      const body = new FormData();
      body.append("company", data.company);
      body.append("name", data.name);
      body.append("email", data.email);
      body.append("phone", data.phone);
      if (data.service) body.append("service", data.service);
      if (data.projectType) body.append("budget", data.projectType);
      if (data.eventDate) body.append("eventDate", data.eventDate);
      if (data.location) body.append("location", data.location);
      const intentNote = isDesign ? "[Design enquiry] " : "";
      if (data.message || intentNote) body.append("message", `${intentNote}${data.message || ""}`.trim());
      if (file) body.append("file", file);

      const res = await fetch(`${siteConfig.apiUrl}/quotes`, {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error("fail");
      setStatus("success");
      reset({ phone: "", service: isDesign ? "Exhibition Stand Design" : "" });
      setFile(null);
    } catch {
      setStatus("error");
    }
  });

  return (
    <section className="section-pad bg-white">
      <div className="container-premium max-w-4xl">
        <SectionHeading eyebrow="Enquiry" title={heading} description={description} />

        <FadeUp delay={0.1}>
          <form onSubmit={onSubmit} className="mt-12 grid gap-6 sm:grid-cols-2">
            <Field label="Name *" error={errors.name?.message}>
              <input className={inputCls} autoComplete="name" {...register("name")} />
            </Field>
            <Field label="Company *" error={errors.company?.message}>
              <input className={inputCls} autoComplete="organization" {...register("company")} />
            </Field>
            <Field label="Email *" error={errors.email?.message}>
              <input type="email" className={inputCls} autoComplete="email" {...register("email")} />
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
            <Field label="Service">
              <select className={inputCls} defaultValue="" {...register("service")}>
                <option value="">Select service</option>
                {approvedServices.map((s) => (
                  <option key={s.slug} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Event / Project Type">
              <select className={inputCls} defaultValue="" {...register("projectType")}>
                <option value="">Select type</option>
                {projectTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Location">
              <input className={inputCls} placeholder="City / venue" {...register("location")} />
            </Field>
            <Field label="Event Date">
              <input type="date" className={inputCls} {...register("eventDate")} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Message">
                <textarea
                  rows={5}
                  className={inputCls}
                  placeholder="Scope, objectives, audience, or any reference materials"
                  {...register("message")}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                File upload (optional — brief, floor plan, brand deck)
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
                {status === "loading" ? "Submitting…" : submitLabel}
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
