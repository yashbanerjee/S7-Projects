"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FadeUp, SectionHeading } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/brand";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

export function ContactClient({
  email,
  phone,
  whatsapp,
  address,
  social,
}: {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  social: { linkedin: string; instagram: string; x: string };
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (data) => {
    setStatus("loading");
    try {
      const res = await fetch(`${siteConfig.apiUrl}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  });

  const wa = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

  return (
    <section className="section-pad bg-white">
      <div className="container-premium grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Details"
            title="How to reach us"
            description="Prefer email, WhatsApp, or a structured enquiry — choose the channel that suits your team."
          />
          <FadeUp delay={0.1}>
            <ul className="mt-10 space-y-6">
              <li className="flex gap-4">
                <Mail className="mt-1 h-5 w-5 text-pink" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Email</p>
                  <a href={`mailto:${email}`} className="mt-1 block text-lg hover:text-pink">
                    {email}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <Phone className="mt-1 h-5 w-5 text-pink" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Phone</p>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="mt-1 block text-lg hover:text-pink">
                    {phone}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <MessageCircle className="mt-1 h-5 w-5 text-pink" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">WhatsApp</p>
                  <a href={wa} target="_blank" rel="noreferrer" className="mt-1 block text-lg hover:text-pink">
                    Chat with us
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <MapPin className="mt-1 h-5 w-5 text-pink" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Studio</p>
                  <p className="mt-1 text-lg leading-relaxed">{address}</p>
                </div>
              </li>
            </ul>
            <div className="mt-8 flex gap-5 text-sm">
              <a href={social.linkedin} className="text-muted hover:text-pink" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={social.instagram} className="text-muted hover:text-pink" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={social.x} className="text-muted hover:text-pink" target="_blank" rel="noreferrer">
                X
              </a>
            </div>
          </FadeUp>
        </div>

        <div className="lg:col-span-7">
          <FadeUp>
            <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">Name</span>
                <input className={inputCls} {...register("name")} />
                {errors.name && <span className="text-xs text-pink">{errors.name.message}</span>}
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">Email</span>
                <input type="email" className={inputCls} {...register("email")} />
                {errors.email && <span className="text-xs text-pink">{errors.email.message}</span>}
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">Phone</span>
                <input className={inputCls} {...register("phone")} />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">Subject</span>
                <input className={inputCls} {...register("subject")} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">Message</span>
                <textarea rows={5} className={inputCls} {...register("message")} />
                {errors.message && <span className="text-xs text-pink">{errors.message.message}</span>}
              </label>
              <div className="sm:col-span-2 flex items-center gap-4">
                <Button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Sending…" : "Send Message"}
                </Button>
                {status === "success" && <p className="text-sm text-pink">Message sent. We will respond shortly.</p>}
                {status === "error" && (
                  <p className="text-sm text-pink">Unable to send. Please email {email} directly.</p>
                )}
              </div>
            </form>
          </FadeUp>
        </div>
      </div>

      <div className="container-premium mt-20">
        <div className="overflow-hidden border border-line">
          <iframe
            title="Project S7 location map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1785!2d55.2708!3d25.1867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDExJzEyLjEiTiA1NcKwMTYnMTQuOSJF!5e0!3m2!1sen!2s!4v1700000000000"
            className="h-[420px] w-full grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full border-b border-line bg-transparent py-3 text-sm outline-none transition focus:border-pink";
