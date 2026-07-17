"use client";

import { useEffect, useRef } from "react";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    // Backdrop-click-to-close is supplementary here, not the only way to
    // close: native Escape (dialog's default "cancel" behavior) and the
    // visible "Cerrar" button inside both already cover keyboard/AT users.
    // oxlint-disable-next-line click-events-have-key-events no-noninteractive-element-interactions
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // A click that lands on the <dialog> element itself (not its
        // children) means it hit the ::backdrop -- close like clicking
        // outside a normal overlay would.
        if (e.target === ref.current) ref.current?.close();
      }}
      className="fixed inset-0 m-auto max-h-[85vh] w-full max-w-lg overflow-y-auto rounded bg-dark p-0 text-paper ring-1 ring-extra backdrop:bg-dark/80"
    >
      {children}
    </dialog>
  );
}
