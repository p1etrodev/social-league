import Image from "next/image";
import Link from "next/link";

const HOME_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
  </svg>
);

export function Navbar() {
  return (
    <>
      <nav className="hidden w-full max-w-60 shrink-0 flex-col gap-1 bg-dark sm:flex">
        <Link href="/" className="flex items-center gap-4 p-4 text-primary">
          <Image src="/jungle.png" alt="Social League" width={24} height={27} />
          <h1 className="font-heading text-2xl font-black">Social League</h1>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-4 border-b-2 border-transparent p-4 font-black text-primary hover:border-primary"
        >
          {HOME_ICON}
          <span>Inicio</span>
        </Link>
        <Link
          href="/champions"
          className="flex items-center gap-4 border-b-2 border-transparent p-4 font-black text-primary hover:border-primary"
        >
          <Image src="/champion-icon.png" alt="" width={24} height={24} />
          <span>Campeones</span>
        </Link>
      </nav>
      <nav className="fixed inset-x-0 bottom-0 flex justify-around bg-dark py-2 sm:hidden">
        <Link href="/" className="p-2 text-primary">
          {HOME_ICON}
        </Link>
        <Link href="/champions" className="p-2 text-primary">
          <Image src="/champion-icon.png" alt="Campeones" width={24} height={24} />
        </Link>
      </nav>
    </>
  );
}
