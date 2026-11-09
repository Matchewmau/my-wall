"use client";

import { Dialog } from "radix-ui";
import { X } from "lucide-react";

export function ImageLightbox({
  src,
  alt,
  triggerLabel,
}: {
  src: string;
  alt: string;
  triggerLabel: string;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={triggerLabel}
          className="mt-3 block w-full cursor-zoom-in rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b5998] focus-visible:ring-offset-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="block max-h-[400px] w-full rounded-lg object-cover"
          />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[92vh] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 items-center justify-center focus:outline-none">
          <Dialog.Title className="sr-only">Full size photo</Dialog.Title>
          <Dialog.Description className="sr-only">
            {alt}. Press Escape, click outside the photo, or use the close
            button to return to the wall.
          </Dialog.Description>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[95vw] rounded-md object-contain shadow-2xl"
          />
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close fullscreen photo"
              className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
