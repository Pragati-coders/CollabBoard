import { describe, it, expect } from "vitest";
import { createBoardSchema, createProjectSchema, inviteMemberSchema } from "@/lib/validations";

describe("createBoardSchema", () => {
  it("passes with valid data", () => {
    const result = createBoardSchema.safeParse({ name: "Sprint Board", projectId: "proj_123" });
    expect(result.success).toBe(true);
  });

  it("fails without name", () => {
    const result = createBoardSchema.safeParse({ name: "", projectId: "proj_123" });
    expect(result.success).toBe(false);
  });

  it("fails without projectId", () => {
    const result = createBoardSchema.safeParse({ name: "My Board", projectId: "" });
    expect(result.success).toBe(false);
  });
});

describe("inviteMemberSchema", () => {
  it("passes with valid email", () => {
    const result = inviteMemberSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  it("fails with invalid email", () => {
    const result = inviteMemberSchema.safeParse({ email: "notanemail" });
    expect(result.success).toBe(false);
  });

  it("defaults role to MEMBER", () => {
    const result = inviteMemberSchema.safeParse({ email: "user@example.com" });
    expect(result.success && result.data.role).toBe("MEMBER");
  });
});

describe("createProjectSchema", () => {
  it("passes with valid data", () => {
    const result = createProjectSchema.safeParse({ name: "My Project", color: "#6366f1" });
    expect(result.success).toBe(true);
  });

  it("fails with invalid hex color", () => {
    const result = createProjectSchema.safeParse({ name: "My Project", color: "red" });
    expect(result.success).toBe(false);
  });
});
