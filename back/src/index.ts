import express from "express";
import cors from "cors";
import { getMetrics } from "./metrics.js";
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

app.listen(port, () => {
  console.log(`metryx back listening on port ${port}`);
});
