import dotenv from "dotenv";
dotenv.config();

function parseOrigins(value: string | undefined, fallback: string[]): string[] {
  if (!value) return fallback;
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  /** Comma-separated list of allowed CORS origins */
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS || process.env.FRONTEND_URL, [
    "http://localhost:3000",
  ]),
  apiUrl: process.env.API_URL || "http://localhost:5000",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminEmail: process.env.ADMIN_EMAIL || "admin@projects7.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin@S7Secure2026",
  adminName: process.env.ADMIN_NAME || "Project S7 Admin",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    enabled: process.env.USE_CLOUDINARY === "true",
  },
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.MAIL_FROM || "Project S7 <noreply@projects7.com>",
    notify: process.env.NOTIFY_EMAIL || "admin@projects7.com",
  },
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 10),
};
