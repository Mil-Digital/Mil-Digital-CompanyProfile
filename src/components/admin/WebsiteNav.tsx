"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavGroup, useAuth, useConfig } from "@payloadcms/ui";

/**
 * "Website → Homepage" at the top of the admin menu. Payload lists globals
 * after every collection, so the homepage would otherwise sit at the very
 * bottom; it is the page editors change most. Uses the same classes as
 * Payload's own nav links.
 */
export function WebsiteNav() {
  const pathname = usePathname();
  const { permissions } = useAuth();
  const {
    config: {
      routes: { admin },
    },
  } = useConfig();
  if (!permissions?.globals?.home?.update) return null;

  const href = `${admin}/globals/home`;
  const active = pathname === href || pathname.startsWith(`${href}/`);
  const label = (
    <>
      {active ? <div className="nav__link-indicator" /> : null}
      <span className="nav__link-label">Homepage</span>
    </>
  );

  return (
    <NavGroup label="Website">
      {pathname === href ? (
        <div className="nav__link" id="nav-global-home">
          {label}
        </div>
      ) : (
        <Link className="nav__link" href={href} id="nav-global-home" prefetch={false}>
          {label}
        </Link>
      )}
    </NavGroup>
  );
}
