import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";

export const SESSION_COOKIE = "metryx_session";
const SESSION_VALUE = "ok";
const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12h

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function isAuthenticated(req: Request): boolean {
  return req.signedCookies[SESSION_COOKIE] === SESSION_VALUE;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (isAuthenticated(req)) {
    next();
    return;
  }
  res.status(401).json({ error: "unauthenticated" });
}

export function setSessionCookie(res: Response) {
  res.cookie(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    signed: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: SESSION_MAX_AGE_MS,
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE);
}
