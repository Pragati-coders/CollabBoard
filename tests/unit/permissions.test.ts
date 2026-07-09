import { describe, it, expect } from "vitest";
import { hasPermission, canManageRole } from "@/lib/permissions";

describe("hasPermission", () => {
  it("OWNER has all permissions", () => {
    expect(hasPermission("OWNER", "billing:access")).toBe(true);
    expect(hasPermission("OWNER", "manage:roles")).toBe(true);
    expect(hasPermission("OWNER", "delete:board")).toBe(true);
  });

  it("GUEST can only view", () => {
    expect(hasPermission("GUEST", "view:all")).toBe(true);
    expect(hasPermission("GUEST", "create:board")).toBe(false);
    expect(hasPermission("GUEST", "delete:board")).toBe(false);
    expect(hasPermission("GUEST", "billing:access")).toBe(false);
  });

  it("MEMBER can create but not delete", () => {
    expect(hasPermission("MEMBER", "create:board")).toBe(true);
    expect(hasPermission("MEMBER", "delete:board")).toBe(false);
  });

  it("ADMIN can manage roles", () => {
    expect(hasPermission("ADMIN", "manage:roles")).toBe(true);
  });
});

describe("canManageRole", () => {
  it("OWNER can manage ADMIN", () => {
    expect(canManageRole("OWNER", "ADMIN")).toBe(true);
  });

  it("ADMIN cannot manage OWNER", () => {
    expect(canManageRole("ADMIN", "OWNER")).toBe(false);
  });

  it("MEMBER cannot manage MEMBER", () => {
    expect(canManageRole("MEMBER", "MEMBER")).toBe(false);
  });
});
