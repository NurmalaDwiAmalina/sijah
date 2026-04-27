"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function Popover({
  trigger,
  children,
  align = "right",
  width = 160,
}: {
  trigger: (props: { onClick: (e: React.MouseEvent) => void; ref: React.RefObject<HTMLButtonElement> }) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right";
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; flip: boolean }>({
    top: 0,
    left: 0,
    flip: false,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function update() {
      const btn = triggerRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const popHeight = popRef.current?.offsetHeight ?? 200;
      const spaceBelow = window.innerHeight - rect.bottom;
      const flip = spaceBelow < popHeight + 16;

      const top = flip ? rect.top - popHeight - 4 : rect.bottom + 4;
      const left =
        align === "right" ? rect.right - width : rect.left;
      setPos({ top, left, flip });
    }
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, align, width]);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (popRef.current?.contains(e.target as Node)) return;
      if (triggerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <>
      {trigger({
        ref: triggerRef,
        onClick: (e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        },
      })}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popRef}
            style={{ position: "fixed", top: pos.top, left: pos.left, width, zIndex: 60 }}
            className="rounded-xl border border-ink-200 bg-white shadow-lg overflow-hidden"
          >
            {children(() => setOpen(false))}
          </div>,
          document.body
        )}
    </>
  );
}
