import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env.js";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

if (env.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|pdf|doc|docx|mp4|mov/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype.split("/")[1] || "") ||
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf" ||
      file.mimetype.includes("document");
    if (ext || mime) cb(null, true);
    else cb(new Error("File type not allowed"));
  },
});

export async function uploadToCloudinary(
  filePath: string,
  folder = "project-s7"
) {
  if (!env.cloudinary.enabled) {
    // API_URL may be https://host or https://host/api — strip trailing /api for static files
    const base = (env.apiUrl || "http://localhost:5000").replace(/\/api\/?$/, "");
    return {
      url: `${base}/uploads/${path.basename(filePath)}`,
      publicId: null as string | null,
    };
  }
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto",
  });
  fs.unlink(filePath, () => undefined);
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteFromCloudinary(publicId: string) {
  if (!env.cloudinary.enabled || !publicId) return;
  await cloudinary.uploader.destroy(publicId);
}
