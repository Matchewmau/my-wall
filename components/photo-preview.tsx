import { X } from "lucide-react";

export function PhotoPreview({
  src,
  alt,
  onRemove,
}: {
  src: string;
  alt: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative mt-3 inline-block max-w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="max-h-48 rounded-md object-contain" />
      <button
        type="button"
        aria-label="Remove photo"
        onClick={onRemove}
        className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow ring-1 ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b5998]"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
