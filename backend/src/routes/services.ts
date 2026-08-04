import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, AppError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { z } from "zod";
import { param } from "../lib/params.js";

const router = Router();

const serviceBodySchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  tagline: z.string().nullable().optional(),
  description: z.string().min(10).optional(),
  overview: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  gallery: z.array(z.string()).optional(),
  process: z.any().optional(),
  benefits: z.any().optional(),
  features: z.any().optional(),
  icon: z.string().nullable().optional(),
  order: z.number().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDesc: z.string().nullable().optional(),
});

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const published = req.query.all !== "true";
    const services = await prisma.service.findMany({
      where: published ? { published: true } : undefined,
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: services });
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const service = await prisma.service.findFirst({
      where: {
        OR: [{ slug: param(req, "slug") }, { id: param(req, "slug") }],
      },
    });
    if (!service) throw new AppError("Service not found", 404);
    res.json({ success: true, data: service });
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const schema = z.object({
      title: z.string().min(2),
      slug: z.string().min(2),
      tagline: z.string().optional(),
      description: z.string().min(10),
      overview: z.string().optional(),
      content: z.string().optional(),
      image: z.string().optional(),
      gallery: z.array(z.string()).optional(),
      process: z.any().optional(),
      benefits: z.any().optional(),
      features: z.any().optional(),
      icon: z.string().optional(),
      order: z.number().optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
      metaTitle: z.string().optional(),
      metaDesc: z.string().optional(),
    });
    const data = schema.parse(req.body);
    const service = await prisma.service.create({ data });
    res.status(201).json({ success: true, data: service });
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = serviceBodySchema.parse(req.body);
    const service = await prisma.service.update({
      where: { id: param(req, "id") },
      data,
    });
    res.json({ success: true, data: service });
  })
);

router.patch(
  "/:id/publish",
  requireAuth,
  asyncHandler(async (req, res) => {
    const published =
      typeof req.body?.published === "boolean" ? req.body.published : undefined;
    const current = await prisma.service.findUnique({
      where: { id: param(req, "id") },
    });
    if (!current) throw new AppError("Service not found", 404);

    const service = await prisma.service.update({
      where: { id: param(req, "id") },
      data: {
        published: published === undefined ? !current.published : published,
      },
    });
    res.json({ success: true, data: service });
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.service.delete({ where: { id: param(req, "id") } });
    res.json({ success: true });
  })
);

export default router;
