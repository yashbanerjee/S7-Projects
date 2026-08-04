import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../lib/upload.js";
import { param } from "../lib/params.js";
import fs from "fs";
import path from "path";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const folder = req.query.folder as string | undefined;
    const data = await prisma.media.findMany({
      where: folder ? { folder } : undefined,
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data });
  })
);

router.post(
  "/",
  requireAuth,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }
    const folder = (req.body.folder as string) || "general";
    const { url, publicId } = await uploadToCloudinary(
      req.file.path,
      `project-s7/${folder}`
    );
    const type = req.file.mimetype.startsWith("video")
      ? "VIDEO"
      : req.file.mimetype.startsWith("image")
        ? "IMAGE"
        : "DOCUMENT";

    const media = await prisma.media.create({
      data: {
        filename: req.file.originalname,
        url,
        publicId,
        type: type as "IMAGE" | "VIDEO" | "DOCUMENT",
        mimeType: req.file.mimetype,
        size: req.file.size,
        alt: req.body.alt,
        folder,
      },
    });
    res.status(201).json({ success: true, data: media });
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const media = await prisma.media.findUnique({
      where: { id: param(req, "id") },
    });
    if (!media) {
      res.status(404).json({ success: false, message: "Media not found" });
      return;
    }
    if (media.publicId) await deleteFromCloudinary(media.publicId);
    if (!media.publicId && media.url.includes("/uploads/")) {
      const name = media.url.split("/uploads/").pop();
      if (name) {
        const filePath = path.join(process.cwd(), "uploads", name);
        fs.unlink(filePath, () => undefined);
      }
    }
    await prisma.media.delete({ where: { id: param(req, "id") } });
    res.json({ success: true });
  })
);

export default router;
