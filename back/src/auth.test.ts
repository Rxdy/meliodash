import { describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import { isAuthenticated, requireAuth, verifyPassword, SESSION_COOKIE } from "./auth.js";
import type { Request, Response } from "express";

describe("verifyPassword", () => {
  const hash = bcrypt.hashSync("correct-horse-battery-staple", 10);

  it("accepts the correct password", () => {
    expect(verifyPassword("correct-horse-battery-staple", hash)).toBe(true);
  });

  it("rejects a wrong password", () => {
    expect(verifyPassword("wrong-password", hash)).toBe(false);
  });
});

function fakeRequest(signedCookies: Record<string, string>): Request {
  return { signedCookies } as unknown as Request;
}

describe("isAuthenticated", () => {
  it("is true when the session cookie is set to ok", () => {
    expect(isAuthenticated(fakeRequest({ [SESSION_COOKIE]: "ok" }))).toBe(true);
  });

  it("is false when the cookie is missing", () => {
    expect(isAuthenticated(fakeRequest({}))).toBe(false);
  });

  it("is false when the cookie has an unexpected value (tampering caught upstream by signing)", () => {
    expect(isAuthenticated(fakeRequest({ [SESSION_COOKIE]: "nope" }))).toBe(false);
  });
});

describe("requireAuth", () => {
  it("calls next() when authenticated", () => {
    const req = fakeRequest({ [SESSION_COOKIE]: "ok" });
    const res = {} as Response;
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("responds 401 when not authenticated", () => {
    const req = fakeRequest({});
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const res = { status } as unknown as Response;
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ error: "unauthenticated" });
  });
});
