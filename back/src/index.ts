import express from "express";
import cookieParser from "cookie-parser";
import { getMetrics } from "./metrics.js";
import { getDockerInfo } from "./docker.js";
import { startHistory } from "./history.js";
import { clearSessionCookie, isAuthenticated, requireAuth, setSessionCookie, verifyPassword } from "./auth.js";

const app = express();
const port = process.env.PORT ?? 3001;

// Front and back are always same-origin in every real deployment (nginx or
// the Vite dev server both proxy /api/* under their own origin), so no CORS
// headers are needed — and none means one less thing to misconfigure.
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET));

startHistory();

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/login", (req, res) => {
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  const hash = process.env.DOCKER_PAGE_PASSWORD_HASH;

  if (!hash || !password || !verifyPassword(password, hash)) {
    res.status(401).json({ error: "invalid credentials" });
    return;
  }

  setSessionCookie(res);
  res.json({ ok: true });
});

app.get("/api/auth/check", (req, res) => {
  res.json({ authenticated: isAuthenticated(req) });
});

app.post("/api/auth/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get("/api/metrics", async (_req, res) => {
  try {
    const metrics = await getMetrics();
    res.json(metrics);
  } catch (err) {
    console.error("failed to read metrics", err);
    res.status(500).json({ error: "failed to read metrics" });
  }
});

// Served separately from /api/metrics so it can be gated behind its own
// auth on the public deployment: container/project names are more sensitive
// than raw CPU/RAM percentages.
app.get("/api/docker", requireAuth, async (_req, res) => {
  try {
    const docker = await getDockerInfo();
    res.json(docker);
  } catch (err) {
    console.error("failed to read docker info", err);
    res.status(500).json({ error: "failed to read docker info" });
  }
});

app.listen(port, () => {
  console.log(`metryx back listening on port ${port}`);
});
