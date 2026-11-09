import Image from "next/image";
import { ExternalLink, Mail } from "lucide-react";
import { profile } from "@/lib/profile";

const linkClass =
  "inline-flex items-center gap-2 rounded-sm text-[#3b5998] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b5998]";

export function ProfileCard() {
  return (
    <div>
      <div className="flex items-center gap-4 md:block">
        <div className="w-24 shrink-0 md:w-full">
          <Image
            src={profile.photo}
            alt={profile.name}
            width={600}
            height={750}
            preload
            sizes="(min-width: 1024px) 300px, (min-width: 768px) 260px, 96px"
            className="aspect-[4/5] w-full rounded-md object-cover object-top"
          />
        </div>
        <div className="min-w-0 md:mt-3">
          <h1 className="text-xl font-bold md:text-2xl">{profile.name}</h1>
          <p className="text-sm text-[#65676b]">wall</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-[#dddfe2] p-3">
        <h2 className="text-sm font-semibold text-[#1c1e21]">Information</h2>
        <dl className="mt-2 space-y-2 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[#65676b]">
              Networks
            </dt>
            <dd>{profile.network}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[#65676b]">
              Current City
            </dt>
            <dd>{profile.city}</dd>
          </div>
        </dl>
      </div>

      <ul className="mt-3 space-y-1 text-sm">
        <li>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            GitHub
          </a>
        </li>
        <li>
          <a
            href={profile.links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Facebook
          </a>
        </li>
        <li>
          <a href={profile.links.email} className={linkClass}>
            <Mail className="size-4" aria-hidden="true" />
            Email
          </a>
        </li>
      </ul>
    </div>
  );
}
