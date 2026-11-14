import Image from "next/image";
import { CameraIcon } from "@/components/brand/icons";
import { formatCaptureTime } from "@/lib/dates";

type Props = {
  /** Image URL, or null to show the grey placeholder. */
  src: string | null;
  alt: string;
  capturedAt: Date;
  sizes?: string;
  priority?: boolean;
  /** e.g. "object-right" to frame part of the photo */
  imgClassName?: string;
};

/** 4:3 photo, 6px radius, capture time below in Plex Mono 12px (SPEC section 6). */
export function PhotoTile({
  src,
  alt,
  capturedAt,
  sizes = "(min-width: 720px) 340px, 50vw",
  priority = false,
  imgClassName = "",
}: Props) {
  return (
    <figure className="m-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-rule">
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${imgClassName}`} />
        ) : (
          // TODO: real photo
          <div role="img" aria-label={`${alt} (photo to come)`} className="flex h-full w-full items-center justify-center text-ink-muted">
            <CameraIcon />
          </div>
        )}
      </div>
      <figcaption className="mt-1 font-mono text-caption text-ink-muted">
        <time dateTime={capturedAt.toISOString()}>{formatCaptureTime(capturedAt)}</time>
      </figcaption>
    </figure>
  );
}
