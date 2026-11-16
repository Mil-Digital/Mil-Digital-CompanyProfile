"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useConfig } from "@payloadcms/ui";

/**
 * A card inside the Homepage form that points to where a list is edited
 * (client logos, case studies, testimonials, articles). Opens in a new tab
 * so unsaved homepage changes are never lost.
 */
export function ManageLink({ href, label, text }: { href: string; label: string; text: string }) {
  const {
    config: {
      routes: { admin },
    },
  } = useConfig();
  return (
    <Link className="mil-manage" href={`${admin}${href}`} target="_blank" rel="noreferrer" prefetch={false}>
      <span>
        <strong>{label}</strong>
        <small>{text}</small>
      </span>
      <ArrowUpRight aria-hidden size={18} />
    </Link>
  );
}
