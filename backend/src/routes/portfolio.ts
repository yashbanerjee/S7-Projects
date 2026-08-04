import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, AppError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { z } from "zod";
import { param } from "../lib/params.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const category = req.query.category as string | undefined;
    const featured = req.query.featured === "true";
    const all = req.query.all === "true";

    const items = await prisma.portfolio.findMany({
      where: {
        ...(all ? {} : { published: true }),
        ...(category && category !== "all" ? { category } : {}),
        ...(featured ? { featured: true } : {}),
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.json({ success: true, data: items });
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const item = await prisma.portfolio.findFirst({
      where: {
        OR: [{ slug: param(req, "slug") }, { id: param(req, "slug") }],
      },
    });
    if (!item) throw new AppError("Portfolio item not found", 404);
    res.json({ success: true, data: item });
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const schema = z.object({
      title: z.string().min(2),
      slug: z.string().min(2),
      category: z.string(),
      client: z.string().optional(),
      location: z.string().optional(),
      year: z.string().optional(),
      description: z.string(),
      content: z.string().optional(),
      coverImage: z.string(),
      gallery: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
      order: z.number().optional(),
      metaTitle: z.string().optional(),
      metaDesc: z.string().optional(),
    });
    const data = schema.parse(req.body);
    const item = await prisma.portfolio.create({ data });
    res.status(201).json({ success: true, data: item });
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const item = await prisma.portfolio.update({
      where: { id: param(req, "id") },
      data: req.body,
    });
    res.json({ success: true, data: item });
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.portfolio.delete({ where: { id: param(req, "id") } });
    res.json({ success: true });
  })
);

export default router;
