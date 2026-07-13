import express from "express";
import cors from "cors";
import { getMetrics } from "./metrics.js";
import { getDockerInfo } from "./docker.js";
import { startHistory } from "./history.js";

const app = express();
const port = process.env.PORT ?? 3001;

app.use(cors());

startHistory();

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
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
app.get("/api/docker", async (_req, res) => {
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
