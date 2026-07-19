"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isAboutPage = pathname === "/about";

  return (
    <footer
      className={`sticky bottom-16 z-10 w-full border-t border-extra/20 bg-surface/90 p-3 text-center text-xs text-muted backdrop-blur-sm sm:bottom-0 ${
        isAboutPage ? "flex" : "hidden sm:flex"
      } items-center justify-center`}
    >
      Made with ❤️ by{" "}
      <a
        href="https://pietrodev.up.railway.app"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 font-bold text-primary hover:text-primary-bright"
      >
        pietrodev
      </a>
    </footer>
  );
}
