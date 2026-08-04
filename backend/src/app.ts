import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import portfolioRoutes from "./routes/portfolio.js";
import quoteRoutes from "./routes/quotes.js";
import messageRoutes from "./routes/messages.js";
import jobRoutes from "./routes/jobs.js";
import contentRoutes from "./routes/content.js";
import mediaRoutes from "./routes/media.js";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (env.corsOrigins.includes("*") || env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (/\.up\.railway\.app$/i.test(origin) || /\.railway\.app$/i.test(origin)) {
        return callback(null, true);
      }
      if (env.frontendUrl && origin === env.frontendUrl) {
        return callback(null, true);
      }
      // Never throw — throwing surfaces as 500 instead of CORS headers
      console.warn("[cors] blocked origin:", origin);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 400,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", async (_req, res) => {
  try {
    const admins = await prisma.admin.count();
    res.json({
      success: true,
      service: "Project S7 API",
      time: new Date().toISOString(),
      database: "connected",
      hasAdmin: admins > 0,
    });
  } catch {
    res.status(503).json({
      success: false,
      service: "Project S7 API",
      database: "disconnected",
      hasAdmin: false,
    });
  }
});

/** Lists public API surface for diagnostics */
app.get("/api", (_req, res) => {
  res.json({
    success: true,
    name: "Project S7 API",
    endpoints: {
      health: "GET /api/health",
      auth: {
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
        logout: "POST /api/auth/logout",
      },
      public: [
        "GET /api/services",
        "GET /api/portfolio",
        "GET /api/content/testimonials",
        "GET /api/content/faqs",
        "GET /api/content/industries",
        "GET /api/content/settings",
        "GET /api/jobs",
        "POST /api/quotes",
        "POST /api/messages",
        "POST /api/jobs/:id/apply",
      ],
      admin: [
        "GET /api/content/dashboard",
        "CRUD /api/services (auth)",
        "CRUD /api/portfolio (auth)",
        "GET|PATCH|DELETE /api/quotes (auth)",
        "GET|PATCH|DELETE /api/messages (auth)",
        "CRUD /api/jobs (auth)",
        "CRUD /api/content/faqs (auth)",
        "CRUD /api/content/testimonials (auth)",
        "CRUD /api/media (auth)",
        "PUT /api/content/settings/:key (auth)",
      ],
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/media", mediaRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
