import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { param } from "../lib/params.js";

const router = Router();

// Testimonials
router.get(
  "/testimonials",
  asyncHandler(async (req, res) => {
    const all = req.query.all === "true";
    const data = await prisma.testimonial.findMany({
      where: all ? undefined : { published: true },
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data });
  })
);

router.post(
  "/testimonials",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await prisma.testimonial.create({ data: req.body });
    res.status(201).json({ success: true, data });
  })
);

router.put(
  "/testimonials/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await prisma.testimonial.update({
      where: { id: param(req, "id") },
      data: req.body,
    });
    res.json({ success: true, data });
  })
);

router.delete(
  "/testimonials/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.testimonial.delete({ where: { id: param(req, "id") } });
    res.json({ success: true });
  })
);

// FAQ
router.get(
  "/faqs",
  asyncHandler(async (req, res) => {
    const all = req.query.all === "true";
    const q = (req.query.q as string) || "";
    const data = await prisma.fAQ.findMany({
      where: {
        ...(all ? {} : { published: true }),
        ...(q
          ? {
              OR: [
                { question: { contains: q, mode: "insensitive" } },
                { answer: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data });
  })
);

router.post(
  "/faqs",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await prisma.fAQ.create({ data: req.body });
    res.status(201).json({ success: true, data });
  })
);

router.put(
  "/faqs/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await prisma.fAQ.update({
      where: { id: param(req, "id") },
      data: req.body,
    });
    res.json({ success: true, data });
  })
);

router.delete(
  "/faqs/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.fAQ.delete({ where: { id: param(req, "id") } });
    res.json({ success: true });
  })
);

// Industries
router.get(
  "/industries",
  asyncHandler(async (req, res) => {
    const all = req.query.all === "true";
    const data = await prisma.industry.findMany({
      where: all ? undefined : { published: true },
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data });
  })
);

router.post(
  "/industries",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await prisma.industry.create({ data: req.body });
    res.status(201).json({ success: true, data });
  })
);

router.put(
  "/industries/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await prisma.industry.update({
      where: { id: param(req, "id") },
      data: req.body,
    });
    res.json({ success: true, data });
  })
);

router.delete(
  "/industries/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.industry.delete({ where: { id: param(req, "id") } });
    res.json({ success: true });
  })
);

// Settings
router.get(
  "/settings",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.setting.findMany();
    const data = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    res.json({ success: true, data });
  })
);

router.put(
  "/settings/:key",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = await prisma.setting.upsert({
      where: { key: param(req, "key") },
      create: { key: param(req, "key"), value: req.body.value ?? req.body },
      update: { value: req.body.value ?? req.body },
    });
    res.json({ success: true, data });
  })
);

// Dashboard stats
router.get(
  "/dashboard",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const [
      portfolio,
      services,
      quotes,
      messages,
      jobs,
      applications,
      media,
      faqs,
    ] = await Promise.all([
      prisma.portfolio.count(),
      prisma.service.count(),
      prisma.quote.count({ where: { status: "NEW" } }),
      prisma.message.count({ where: { status: "NEW" } }),
      prisma.job.count({ where: { active: true } }),
      prisma.application.count({ where: { status: "NEW" } }),
      prisma.media.count(),
      prisma.fAQ.count(),
    ]);
    const recentQuotes = await prisma.quote.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });
    const recentMessages = await prisma.message.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });
    res.json({
      success: true,
      data: {
        stats: {
          portfolio,
          services,
          quotes,
          messages,
          jobs,
          applications,
          media,
          faqs,
        },
        recentQuotes,
        recentMessages,
      },
    });
  })
);

export default router;
