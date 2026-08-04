import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, AppError } from "../middleware/error.js";
import { requireAuth, signToken, type AuthRequest } from "../middleware/auth.js";

const router = Router();

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const { email, password } = schema.parse(req.body);
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.active) throw new AppError("Invalid credentials", 401);
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) throw new AppError("Invalid credentials", 401);

    const token = signToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  })
);

router.post(
  "/logout",
  asyncHandler(async (_req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });
    res.json({ success: true, admin });
  })
);

router.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const schema = z.object({
      name: z.string().min(2).optional(),
      password: z.string().min(8).optional(),
      avatar: z.string().url().optional(),
    });
    const data = schema.parse(req.body);
    const update: Record<string, string> = {};
    if (data.name) update.name = data.name;
    if (data.avatar) update.avatar = data.avatar;
    if (data.password) update.password = await bcrypt.hash(data.password, 12);

    const admin = await prisma.admin.update({
      where: { id: req.admin!.id },
      data: update,
      select: { id: true, email: true, name: true, role: true, avatar: true },
    });
    res.json({ success: true, admin });
  })
);

export default router;
