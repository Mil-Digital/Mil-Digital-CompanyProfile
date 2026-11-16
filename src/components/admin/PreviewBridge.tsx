"use client";

import * as React from "react";

/** One desktop screen; the preview renders at this size and scales down to fit. */
const SCREEN = { width: 1440, height: 900 };
const GAP = 16;

/** Opens the form tab a preview section asked for (components/preview/edit-overlay). */
function openTab(tab: string) {
  const label = (b: Element) => (b.textContent ?? "").trim().replace(/\d+$/, "").trim();
  const button = [...document.querySelectorAll<HTMLButtonElement>(".tabs-field__tab-button")].find((b) => label(b) === tab);
  if (!button) return;
  button.click();
  window.scrollTo({ top: button.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
  const wrap = button.closest(".tabs-field")?.querySelector<HTMLElement>(".tabs-field__content-wrap");
  if (!wrap) return;
  wrap.classList.remove("mil-flash");
  void wrap.offsetWidth; // restart the highlight
  wrap.classList.add("mil-flash");
  window.setTimeout(() => {
    wrap.classList.remove("mil-flash");
    wrap.querySelector<HTMLElement>("input:not([type=hidden]), textarea, [contenteditable=true]")?.focus({ preventScroll: true });
  }, 700);
}

/**
 * Live preview bridge, wrapped around the admin as a provider (renders
 * nothing itself):
 *
 * 1. "Edit" buttons in the preview post { type: "mil-edit", tab }; the
 *    matching tab of the form opens, scrolls into view and glows.
 *
 * 2. Live preview "fit to pane": in the default (Responsive) mode the preview
 * pane is narrower than a desktop screen, so the site would switch to its
 * tablet layout or be cut off. This renders one 1440 × 900 desktop screen
 * and scales it down until all of it fits (styles: .mil-fit in
 * custom.scss); scroll inside it as on a real screen. Picking Tablet or Mobile in the toolbar uses Payload's own
 * sizing instead.
 */
export function PreviewBridge({ children }: { children?: React.ReactNode }) {
  React.useEffect(() => {
    let main: HTMLElement | null = null;
    let resize: ResizeObserver | null = null;

    const fit = () => {
      if (!main) return;
      const free = !main.closest(".live-preview-window")?.classList.contains("live-preview-window--has-breakpoint");
      const width = main.clientWidth - GAP * 2;
      const height = main.clientHeight - GAP * 2;
      const scale = Math.min(width / SCREEN.width, height / SCREEN.height, 1);
      const on = free && width > 0 && height > 0;
      main.classList.toggle("mil-fit", on);
      if (on) {
        main.style.setProperty("--mil-fit", String(scale));
        main.style.setProperty("--mil-fit-x", `${GAP + (width - SCREEN.width * scale) / 2}px`);
        main.style.setProperty("--mil-fit-y", `${GAP}px`);
      }
    };

    // The pane mounts and unmounts as the preview is toggled or the page changes.
    const attach = () => {
      const found = document.querySelector<HTMLElement>(".live-preview-window__main");
      if (found !== main) {
        resize?.disconnect();
        main = found;
        resize = main ? new ResizeObserver(fit) : null;
        if (main) resize?.observe(main);
      }
      fit();
    };

    const onMessage = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === "mil-edit" && typeof e.data.tab === "string") openTab(e.data.tab);
    };
    window.addEventListener("message", onMessage);

    const watch = new MutationObserver(attach);
    watch.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
    attach();
    return () => {
      window.removeEventListener("message", onMessage);
      watch.disconnect();
      resize?.disconnect();
    };
  }, []);

  return <>{children}</>;
}
