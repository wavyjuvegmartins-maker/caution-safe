import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Landing-page photos are downloaded by hand into public/images (SPEC section 7).
 * Returns the public URL if the file is there, otherwise null so PhotoTile shows
 * the grey placeholder. Never hot-links.
 */
export function localPhoto(file: "kitchen.jpg" | "room-move-in.jpg" | "room-move-out.jpg"): string | null {
  return existsSync(path.join(process.cwd(), "public", "images", file)) ? `/images/${file}` : null;
}
