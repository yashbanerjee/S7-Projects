import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { notifyAdmin, sendMail } from "../lib/mail.js";
import { z } from "zod";
import { param } from "../lib/params.js";

const router = Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().optional(),
      subject: z.string().optional(),
      message: z.string().min(10),
    });
    const data = schema.parse(req.body);
    const message = await prisma.message.create({ data });

    await notifyAdmin(
      `Contact Message – ${data.name}`,
      `<h2>New Contact Message</h2>
       <p><strong>Name:</strong> ${data.name}</p>
       <p><strong>Email:</strong> ${data.email}</p>
       <p><strong>Phone:</strong> ${data.phone || "—"}</p>
       <p><strong>Subject:</strong> ${data.subject || "—"}</p>
       <p>${data.message}</p>`
    );

    await sendMail({
      to: data.email,
      subject: "Thank you for contacting Project S7",
      html: `<p>Dear ${data.name},</p>
        <p>We have received your message and will get back to you shortly.</p>
        <p>Warm regards,<br/>Project S7</p>`,
    });

    res.status(201).json({ success: true, data: message });
  })
);

router.get(
  "/",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const data = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data });
  })
);

router.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await prisma.message.update({
      where: { id: param(req, "id") },
      data: req.body,
    });
    res.json({ success: true, data });
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.message.delete({ where: { id: param(req, "id") } });
    res.json({ success: true });
  })
);

export default router;
