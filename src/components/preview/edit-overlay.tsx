"use client";

import * as React from "react";
import { PenLine } from "lucide-react";

/** data-cms key on a section → the tab of the edit form that holds its content. */
export type EditZones = Record<string, { tab: string; label?: string }>;

type Box = { key: string; top: number; left: number; width: number; height: number };

/**
 * Click-to-edit for the CMS live preview. Hovering a section outlines it
 * and shows an "Edit" button; pressing it tells the admin (the parent
 * window) which tab to open, see components/admin/PreviewBridge. Sections opt
 * in with a data-cms attribute. Inactive outside the preview pane.
 */
export function EditOverlay({ zones }: { zones: EditZones }) {
  const [box, setBox] = React.useState<Box | null>(null);
  const current = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    // Only inside the CMS preview pane, never on a page opened on its own.
    if (window.parent === window) return;
    let frame = 0;
    const measure = () => {
      const el = current.current;
      if (!el) return setBox(null);
      const r = el.getBoundingClientRect();
      setBox({ key: el.dataset.cms ?? "", top: r.top, left: r.left, width: r.width, height: r.height });
    };
    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-edit-chip]")) return;
      const zone = target?.closest<HTMLElement>("[data-cms]") ?? null;
      const el = zone && zones[zone.dataset.cms ?? ""] ? zone : null;
      if (el !== current.current) {
        current.current = el;
        measure();
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const onLeave = () => {
      current.current = null;
      setBox(null);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [zones]);

  if (!box) return null;
  const zone = zones[box.key];
  if (!zone) return null;

  const edit = () => window.parent.postMessage({ type: "mil-edit", tab: zone.tab }, window.location.origin);
  // Keep the button below the fixed site header and inside the screen.
  const chipTop = Math.min(Math.max(box.top + 14, 96), box.top + box.height - 48);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed z-[90] rounded-[18px] outline outline-2 -outline-offset-2 outline-[#00adee] transition-all duration-200 ease-out"
        style={{ top: box.top, left: box.left, width: box.width, height: box.height, boxShadow: "inset 0 0 0 9999px rgb(0 173 238 / 0.06)" }}
      />
      <button
        type="button"
        data-edit-chip
        onClick={edit}
        className="fixed z-[95] flex items-center gap-2 rounded-full bg-[#00adee] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_30px_-10px_rgb(0_173_238/0.9)] transition-transform duration-200 hover:scale-105"
        style={{ top: chipTop, left: box.left + 18 }}
      >
        <PenLine className="size-3.5" aria-hidden />
        Edit {zone.label ?? zone.tab}
      </button>
    </>
  );
}
