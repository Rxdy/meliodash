import { describe, expect, it } from "vitest";
import { getMetrics } from "./metrics.js";

describe("getMetrics", () => {
  it("returns a metrics snapshot with the expected shape", async () => {
    const metrics = await getMetrics();

    expect(typeof metrics.timestamp).toBe("number");
    expect(typeof metrics.uptimeSeconds).toBe("number");

    expect(typeof metrics.cpu.loadPercent).toBe("number");
    expect(metrics.cpu.loadPercent).toBeGreaterThanOrEqual(0);
    expect(typeof metrics.cpu.cores).toBe("number");
    expect(metrics.cpu.cores).toBeGreaterThan(0);

    expect(metrics.memory.totalBytes).toBeGreaterThan(0);
    expect(metrics.memory.usedPercent).toBeGreaterThanOrEqual(0);
    expect(metrics.memory.usedPercent).toBeLessThanOrEqual(100);

    expect(Array.isArray(metrics.disks)).toBe(true);
    expect(Array.isArray(metrics.network)).toBe(true);
  });
});
