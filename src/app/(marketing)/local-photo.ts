import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Landing-page photos live in public/images (SPEC section 7). Returns the public
 * URL if the file is there, otherwise null so PhotoTile shows the grey placeholder.
 * Never hot-links.
 *
 * kitchen.jpg: Emmanuel Ikwuegbu on Unsplash (Unsplash License), Lagos.
 */
export function localPhoto(file: "kitchen.jpg"): string | null {
  return existsSync(path.join(process.cwd(), "public", "images", file)) ? `/images/${file}` : null;
}
