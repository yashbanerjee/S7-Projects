import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, AppError } from "../middleware/error.js";
import { requireAuth, signToken, type AuthRequest } from "../middleware/auth.js";
import { env } from "../config/env.js";

const router = Router();

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const schema = z.object({
      email: z.string().email().transform((v) => v.toLowerCase().trim()),
      password: z.string().min(1, "Password is required"),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message || "Invalid login payload", 400);
    }

    const { email, password } = parsed.data;

    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      // Last-chance create if bootstrap failed earlier
      const hash = await bcrypt.hash(env.adminPassword, 12);
      await prisma.admin.create({
        data: {
          email: env.adminEmail.toLowerCase().trim(),
          name: env.adminName,
          password: hash,
          role: "ADMIN",
          active: true,
        },
      });
      console.log("[auth] emergency admin bootstrap on login");
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.active) {
      throw new AppError("Invalid email or password", 401);
    }

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = signToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Cross-site cookie for different frontend/API hostnames on Railway
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
      secure: env.nodeEnv === "production",
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
    res.clearCookie("token", {
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
      secure: env.nodeEnv === "production",
    });
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
