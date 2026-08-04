import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { notifyAdmin, sendMail } from "../lib/mail.js";
import { upload, uploadToCloudinary } from "../lib/upload.js";
import { z } from "zod";
import { param } from "../lib/params.js";

const router = Router();

router.post(
  "/",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const schema = z.object({
      company: z.string().min(2),
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(6),
      country: z.string().optional(),
      service: z.string().optional(),
      budget: z.string().optional(),
      eventDate: z.string().optional(),
      location: z.string().optional(),
      message: z.string().optional(),
    });
    const data = schema.parse(req.body);

    let fileUrl: string | undefined;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.path, "project-s7/quotes");
      fileUrl = uploaded.url;
    }

    const quote = await prisma.quote.create({
      data: { ...data, fileUrl },
    });

    await notifyAdmin(
      `New Quote Request – ${data.company}`,
      `<h2>New Quote Request</h2>
       <p><strong>Company:</strong> ${data.company}</p>
       <p><strong>Name:</strong> ${data.name}</p>
       <p><strong>Email:</strong> ${data.email}</p>
       <p><strong>Phone:</strong> ${data.phone}</p>
       <p><strong>Service:</strong> ${data.service || "—"}</p>
       <p><strong>Budget:</strong> ${data.budget || "—"}</p>
       <p><strong>Event Date:</strong> ${data.eventDate || "—"}</p>
       <p><strong>Location:</strong> ${data.location || "—"}</p>
       <p><strong>Message:</strong> ${data.message || "—"}</p>`
    );

    await sendMail({
      to: data.email,
      subject: "We received your quote request – Project S7",
      html: `<p>Dear ${data.name},</p>
        <p>Thank you for contacting Project S7. Our team has received your request and will respond within 24–48 business hours.</p>
        <p>Warm regards,<br/>Project S7 Team</p>`,
    });

    res.status(201).json({ success: true, data: quote });
  })
);

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;
    const data = await prisma.quote.findMany({
      where: status ? { status: status as never } : undefined,
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data });
  })
);

router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await prisma.quote.findUnique({ where: { id: param(req, "id") } });
    res.json({ success: true, data });
  })
);

router.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await prisma.quote.update({
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
    await prisma.quote.delete({ where: { id: param(req, "id") } });
    res.json({ success: true });
  })
);

export default router;
