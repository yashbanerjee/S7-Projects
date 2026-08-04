import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function createTransport() {
  if (!env.smtp.host || !env.smtp.user) return null;
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const transport = createTransport();
  if (!transport) {
    console.log("[mail:dev]", options.subject, "→", options.to);
    return { queued: false, dev: true };
  }
  await transport.sendMail({
    from: env.smtp.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
  return { queued: true };
}

export async function notifyAdmin(subject: string, html: string) {
  return sendMail({ to: env.smtp.notify, subject, html });
}
