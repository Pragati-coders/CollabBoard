import { MemberRole } from "@prisma/client";

export type Permission =
  | "create:board"
  | "delete:board"
  | "edit:board"
  | "invite:member"
  | "remove:member"
  | "billing:access"
  | "settings:access"
  | "analytics:access"
  | "manage:roles"
  | "create:project"
  | "delete:project"
  | "view:all";

const ROLE_PERMISSIONS: Record<MemberRole, Permission[]> = {
  OWNER: [
    "create:board", "delete:board", "edit:board",
    "invite:member", "remove:member", "billing:access",
    "settings:access", "analytics:access", "manage:roles",
    "create:project", "delete:project", "view:all",
  ],
  ADMIN: [
    "create:board", "delete:board", "edit:board",
    "invite:member", "remove:member", "settings:access",
    "analytics:access", "manage:roles", "create:project",
    "delete:project", "view:all",
  ],
  MANAGER: [
    "create:board", "edit:board", "invite:member",
    "analytics:access", "create:project", "view:all",
  ],
  MEMBER: [
    "create:board", "edit:board", "create:project", "view:all",
  ],
  GUEST: ["view:all"],
};

export function hasPermission(role: MemberRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function checkPermission(role: MemberRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Forbidden: missing permission '${permission}'`);
  }
}

export const ROLE_LABELS: Record<MemberRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MANAGER: "Manager",
  MEMBER: "Member",
  GUEST: "Guest",
};

export const ROLE_HIERARCHY: Record<MemberRole, number> = {
  OWNER: 5, ADMIN: 4, MANAGER: 3, MEMBER: 2, GUEST: 1,
};

export function canManageRole(actorRole: MemberRole, targetRole: MemberRole): boolean {
  return ROLE_HIERARCHY[actorRole] > ROLE_HIERARCHY[targetRole];
}
