import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, AppError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { upload, uploadToCloudinary } from "../lib/upload.js";
import { notifyAdmin, sendMail } from "../lib/mail.js";
import { z } from "zod";
import { param } from "../lib/params.js";

const router = Router();

// Public jobs
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const all = req.query.all === "true";
    const data = await prisma.job.findMany({
      where: all ? undefined : { published: true, active: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data });
  })
);

// Applications (must be before /:slug)
router.get(
  "/applications/all",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const data = await prisma.application.findMany({
      include: { job: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data });
  })
);

router.patch(
  "/applications/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await prisma.application.update({
      where: { id: param(req, "id") },
      data: req.body,
    });
    res.json({ success: true, data });
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const job = await prisma.job.findFirst({
      where: { OR: [{ slug: param(req, "slug") }, { id: param(req, "slug") }] },
    });
    if (!job) throw new AppError("Job not found", 404);
    res.json({ success: true, data: job });
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const schema = z.object({
      title: z.string().min(2),
      slug: z.string().min(2),
      department: z.string().optional().nullable(),
      location: z.string().min(2),
      type: z.string().optional(),
      description: z.string().min(10),
      requirements: z.string().optional().nullable(),
      benefits: z.string().optional().nullable(),
      salary: z.string().optional().nullable(),
      active: z.boolean().optional(),
      published: z.boolean().optional(),
    });
    const body = schema.parse(req.body);
    const data = await prisma.job.create({ data: body });
    res.status(201).json({ success: true, data });
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const schema = z
      .object({
        title: z.string().min(2).optional(),
        slug: z.string().min(2).optional(),
        department: z.string().optional().nullable(),
        location: z.string().min(2).optional(),
        type: z.string().optional(),
        description: z.string().min(10).optional(),
        requirements: z.string().optional().nullable(),
        benefits: z.string().optional().nullable(),
        salary: z.string().optional().nullable(),
        active: z.boolean().optional(),
        published: z.boolean().optional(),
      })
      .strict();
    const body = schema.parse(req.body);
    const data = await prisma.job.update({
      where: { id: param(req, "id") },
      data: body,
    });
    res.json({ success: true, data });
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.job.delete({ where: { id: param(req, "id") } });
    res.json({ success: true });
  })
);

// Applications
router.post(
  "/:id/apply",
  upload.single("resume"),
  asyncHandler(async (req, res) => {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().optional(),
      cover: z.string().optional(),
      portfolio: z.string().optional(),
    });
    const body = schema.parse(req.body);
    const job = await prisma.job.findFirst({
      where: { OR: [{ id: param(req, "id") }, { slug: param(req, "id") }] },
    });
    if (!job) throw new AppError("Job not found", 404);

    let resume: string | undefined;
    if (req.file) {
      const up = await uploadToCloudinary(req.file.path, "project-s7/resumes");
      resume = up.url;
    }

    const application = await prisma.application.create({
      data: { ...body, resume, jobId: job.id },
    });

    await notifyAdmin(
      `Job Application – ${job.title}`,
      `<p><strong>${body.name}</strong> applied for <strong>${job.title}</strong></p>
       <p>Email: ${body.email}</p>`
    );
    await sendMail({
      to: body.email,
      subject: `Application received – ${job.title}`,
      html: `<p>Dear ${body.name},</p><p>Thank you for applying for ${job.title} at Project S7. We will review your application shortly.</p>`,
    });

    res.status(201).json({ success: true, data: application });
  })
);

export default router;
