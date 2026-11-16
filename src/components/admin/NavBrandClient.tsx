"use client";

/* eslint-disable @next/next/no-img-element -- Payload renders this outside next/image's loader config. */
import * as React from "react";
import { ArrowUpRight, PanelLeftClose, Pin } from "lucide-react";
import { PIN_COOKIE } from "./nav-prefs";

/**
 * Top of the admin sidebar: the MIL mark, a link to the public website and
 * the pin button. Unpinned (the default) the sidebar is an icon rail that
 * opens over the page on hover; pinned it stays open beside the page.
 * Styles: "Sidebar" in src/app/(payload)/custom.scss.
 */
export function NavBrandClient({ initialPinned }: { initialPinned: boolean }) {
  const [pinned, setPinned] = React.useState(initialPinned);

  // A cookie, so the server renders the right width on the next load (no jump).
  React.useEffect(() => {
    document.cookie = `${PIN_COOKIE}=${pinned ? "1" : "0"}; path=/admin; max-age=31536000; samesite=lax`;
  }, [pinned]);

  const label = pinned ? "Collapse menu (opens on hover)" : "Keep menu open";
  const Icon = pinned ? PanelLeftClose : Pin;

  return (
    <div className={pinned ? "mil-nav-brand" : "mil-nav-brand mil-nav-brand--mini"}>
      <div className="mil-nav-brand__top">
        <span className="mil-nav-brand__logo">
          <img src="/brand/mil-mark-white.png" alt="" width={1200} height={733} />
          <span className="mil-nav-brand__name">
            <strong>MIL Digital</strong>
            <small>Content manager</small>
          </span>
        </span>
        <button type="button" className="mil-nav-brand__toggle" onClick={() => setPinned((p) => !p)} aria-pressed={pinned} title={label}>
          <Icon aria-hidden size={16} strokeWidth={1.8} />
          <span className="mil-sr-only">{label}</span>
        </button>
      </div>
      <a className="mil-nav-brand__site" href="/" target="_blank" rel="noreferrer" title="View website">
        <span aria-hidden className="mil-nav-brand__pulse" />
        <span className="mil-nav-brand__site-label">View website</span>
        <ArrowUpRight aria-hidden size={14} />
      </a>
    </div>
  );
}
