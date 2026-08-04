import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./error.js";
import { prisma } from "../lib/prisma.js";

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  admin?: AuthPayload;
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export async function requireAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;
    const token =
      header?.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;

    if (!token) throw new AppError("Authentication required", 401);

    const decoded = jwt.verify(token, env.jwtSecret) as AuthPayload;
    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
    if (!admin || !admin.active) throw new AppError("Invalid session", 401);

    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };
    next();
  } catch (e) {
    next(e instanceof AppError ? e : new AppError("Invalid or expired token", 401));
  }
}
