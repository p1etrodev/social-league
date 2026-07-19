"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { postsWsUrl } from "@/lib/ws";

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

const INFO_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const BELL_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M12 2a6 6 0 0 0-6 6v3.09c0 .78-.3 1.53-.84 2.1L4 14.5c-.9.94-.25 2.5 1.05 2.5h13.9c1.3 0 1.95-1.56 1.05-2.5l-1.16-1.31A2.98 2.98 0 0 1 18 10.09V8a6 6 0 0 0-6-6Z" />
    <path d="M9.5 19a2.5 2.5 0 0 0 5 0h-5Z" />
  </svg>
);

/** Real-time "there's something new" signal for the nav bell badge, backed
 * by the same `/ws/posts` broadcast the home feed's new-posts banner uses. */
function useHasNewActivity() {
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    function connect() {
      socket = new WebSocket(postsWsUrl());
      socket.onmessage = (rawEvent) => {
        const message = JSON.parse(rawEvent.data) as { event: string };
        if (message.event === "new_post") setHasNew(true);
      };
      socket.onclose = () => {
        if (!cancelled) reconnectTimeout = setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      socket?.close();
    };
  }, []);

  return { hasNew, clear: () => setHasNew(false) };
}

export function Navbar() {
  const { hasNew, clear } = useHasNewActivity();

  return (
    <>
      <nav className="hidden w-full max-w-60 shrink-0 flex-col gap-1 border-r border-extra/20 bg-surface/60 backdrop-blur-sm sm:flex sm:sticky top-0">
        <div className="flex items-center justify-between border-b border-extra/20 p-4">
          <Link href="/" className="flex items-center gap-4 text-primary-bright" onClick={clear}>
            <Image src="/logo.png" alt="Social League" width={24} height={27} />
            <h1 className="font-heading text-2xl font-black">Social League</h1>
          </Link>
          <span className="relative inline-flex text-muted">
            {BELL_ICON}
            {hasNew && (
              <span className="glow-blue animate-dot-pulse absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-secondary" />
            )}
          </span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-4 border-l-2 border-transparent p-4 font-black text-primary-bright hover:border-primary hover:bg-primary/8"
        >
          {HOME_ICON}
          <span>Inicio</span>
        </Link>
        <Link
          href="/champions"
          className="flex items-center gap-4 border-l-2 border-transparent p-4 font-black text-primary-bright hover:border-primary hover:bg-primary/8"
        >
          <Image src="/champion-icon.png" alt="" width={24} height={24} />
          <span>Campeones</span>
        </Link>
        <Link
          href="/trending"
          className="flex items-center gap-4 border-l-2 border-transparent p-4 font-black text-primary-bright hover:border-primary hover:bg-primary/8"
        >
          {TRENDING_ICON}
          <span>Tendencias</span>
        </Link>
        <Link
          href="/about"
          className="flex items-center gap-4 border-l-2 border-transparent p-4 font-black text-primary-bright hover:border-primary hover:bg-primary/8"
        >
          {INFO_ICON}
          <span>Acerca de</span>
        </Link>
      </nav>
      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-extra/20 bg-surface/90 py-2 backdrop-blur-sm sm:hidden">
        <Link href="/" className="p-2 text-primary-bright">
          {HOME_ICON}
        </Link>
        <Link href="/champions" className="p-2 text-primary-bright">
          <Image src="/champion-icon.png" alt="Campeones" width={24} height={24} />
        </Link>
        <Link href="/trending" className="p-2 text-primary-bright">
          {TRENDING_ICON}
        </Link>
        <Link href="/about" className="p-2 text-primary-bright">
          {INFO_ICON}
        </Link>
      </nav>
    </>
  );
}
