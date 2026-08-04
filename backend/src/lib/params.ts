import type { Request } from "express";

/** Express 5 can type params as string | string[] — normalize to string */
export function param(req: Request, key: string): string {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
}
