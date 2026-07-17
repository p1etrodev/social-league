import Image from "next/image";
import Link from "next/link";

const HOME_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
  </svg>
);

const TRENDING_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path
      fillRule="evenodd"
      d="M15.22 6.268a.75.75 0 0 1 .968-.432l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.483a11.2 11.2 0 0 0-5.45 5.174.75.75 0 0 1-1.199.19L9 12.31l-6.22 6.22a.75.75 0 1 1-1.06-1.06l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.605a12.694 12.694 0 0 1 5.68-4.973l1.086-.483-4.251-1.631a.75.75 0 0 1-.432-.97Z"
      clipRule="evenodd"
    />
  </svg>
);

export function Navbar() {
  return (
    <>
      <nav className="hidden w-full max-w-60 shrink-0 flex-col gap-1 border-r border-extra/20 bg-surface/60 backdrop-blur-sm sm:flex sm:sticky top-0">
        <Link
          href="/"
          className="flex items-center gap-4 border-b border-extra/20 p-4 text-primary-bright"
        >
          <Image src="/logo.png" alt="Social League" width={24} height={27} />
          <h1 className="font-heading text-2xl font-black">Social League</h1>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-4 border-l-2 border-transparent p-4 font-black text-primary hover:border-primary hover:bg-primary/8"
        >
          {HOME_ICON}
          <span>Inicio</span>
        </Link>
        <Link
          href="/champions"
          className="flex items-center gap-4 border-l-2 border-transparent p-4 font-black text-primary hover:border-primary hover:bg-primary/8"
        >
          <Image src="/champion-icon.png" alt="" width={24} height={24} />
          <span>Campeones</span>
        </Link>
        <Link
          href="/trending"
          className="flex items-center gap-4 border-l-2 border-transparent p-4 font-black text-primary hover:border-primary hover:bg-primary/8"
        >
          {TRENDING_ICON}
          <span>Tendencias</span>
        </Link>
      </nav>
      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-extra/20 bg-surface/90 py-2 backdrop-blur-sm sm:hidden">
        <Link href="/" className="p-2 text-primary">
          {HOME_ICON}
        </Link>
        <Link href="/champions" className="p-2 text-primary">
          <Image src="/champion-icon.png" alt="Campeones" width={24} height={24} />
        </Link>
        <Link href="/trending" className="p-2 text-primary">
          {TRENDING_ICON}
        </Link>
      </nav>
    </>
  );
}
