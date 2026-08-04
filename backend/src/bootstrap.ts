import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma.js";
import { env } from "./config/env.js";

/**
 * Ensures the app can boot on Railway:
 * - Admin user exists (login works)
 * - Optional full content seed when the DB is empty
 */
export async function bootstrap() {
  console.log("[bootstrap] starting…");

  try {
    await prisma.$connect();
  } catch (e) {
    console.error("[bootstrap] database connection failed", e);
    throw e;
  }

  const email = env.adminEmail.toLowerCase().trim();
  const password = env.adminPassword;
  const name = env.adminName;
  const resetPassword = process.env.ADMIN_RESET_PASSWORD === "true";

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (!existing) {
    const hash = await bcrypt.hash(password, 12);
    await prisma.admin.create({
      data: {
        email,
        name,
        password: hash,
        role: "ADMIN",
        active: true,
      },
    });
    console.log(`[bootstrap] created admin: ${email}`);
  } else if (resetPassword) {
    const hash = await bcrypt.hash(password, 12);
    await prisma.admin.update({
      where: { email },
      data: { password: hash, active: true, name },
    });
    console.log(`[bootstrap] reset admin password for: ${email}`);
  } else {
    console.log(`[bootstrap] admin already exists: ${email}`);
  }

  // Keep at least one site settings row
  const settings = await prisma.setting.findUnique({ where: { key: "site" } });
  if (!settings) {
    await prisma.setting.create({
      data: {
        key: "site",
        value: {
          companyName: "Project S7",
          tagline: "Luxury Corporate Events & Exhibitions",
          email: "hello@projects7.com",
        },
      },
    });
    console.log("[bootstrap] created default site settings");
  }

  // Auto-seed CMS content once if completely empty (services only check)
  const serviceCount = await prisma.service.count();
  const forceSeed = process.env.RUN_SEED_ON_BOOT === "true";
  if (serviceCount === 0 || forceSeed) {
    console.log("[bootstrap] seeding CMS content…");
    try {
      const { seedContent } = await import("./seed-content.js");
      await seedContent(prisma);
      console.log("[bootstrap] content seed complete");
    } catch (e) {
      console.warn("[bootstrap] content seed skipped/failed:", e);
    }
  }

  const adminCount = await prisma.admin.count();
  console.log(`[bootstrap] ready · admins=${adminCount} · services=${await prisma.service.count()}`);
}
