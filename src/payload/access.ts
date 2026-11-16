import type { Access, FieldAccess } from "payload";

/** Roles from PROJECT_SPEC §8. */
export const ROLES = ["admin", "editor", "hr", "sales"] as const;
export type Role = (typeof ROLES)[number];

type WithRoles = { roles?: Role[] | null } | null | undefined;

export const hasRole = (user: unknown, ...roles: Role[]) => Boolean((user as WithRoles)?.roles?.some((r) => roles.includes(r)));

export const anyone: Access = () => true;
export const loggedIn: Access = ({ req }) => Boolean(req.user);
export const admins: Access = ({ req }) => hasRole(req.user, "admin");
/** Site content: admins and editors. */
export const editors: Access = ({ req }) => hasRole(req.user, "admin", "editor");
/** Careers: admins and HR. */
export const hrTeam: Access = ({ req }) => hasRole(req.user, "admin", "hr");
/** Leads: admins and sales. */
export const salesTeam: Access = ({ req }) => hasRole(req.user, "admin", "sales");
/** Content with drafts: the public sees published documents only; signed-in users see drafts too. */
export const publishedOrSignedIn: Access = ({ req }) => (req.user ? true : { _status: { equals: "published" } });
export const adminsField: FieldAccess = ({ req }) => hasRole(req.user, "admin");

/**
 * Hide a collection from the admin menu for roles that can't edit it.
 * Menu only: access control above still decides what each role can read.
 */
export const hiddenUnless =
  (...roles: Role[]) =>
  ({ user }: { user: unknown }) =>
    !hasRole(user, ...roles);
