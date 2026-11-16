import { cookies } from "next/headers";
import { PIN_COOKIE } from "./nav-prefs";
import { NavBrandClient } from "./NavBrandClient";

/** Sidebar brand block; reads the pinned preference so the first paint has the right width. */
export async function NavBrand() {
  const pinned = (await cookies()).get(PIN_COOKIE)?.value === "1";
  return <NavBrandClient initialPinned={pinned} />;
}
