import Link from "next/link";

export function WallHeader() {
  return (
    <header className="bg-[#3b5998]">
      <div className="mx-auto flex h-12 max-w-[1100px] items-center px-4">
        <Link
          href="/"
          aria-label="My Wall home"
          className="rounded-sm text-2xl font-bold lowercase tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          wall
        </Link>
      </div>
    </header>
  );
}
