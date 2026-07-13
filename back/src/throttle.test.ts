import { describe, expect, it, vi } from "vitest";

vi.mock("node:child_process", () => ({
  exec: vi.fn(),
}));
vi.mock("node:util", () => ({
  promisify: () => mockExecAsync,
}));

const mockExecAsync = vi.fn();

const { getThrottleStatus } = await import("./throttle.js");

describe("getThrottleStatus", () => {
  it("reports no issues when the flag mask is zero", async () => {
    mockExecAsync.mockResolvedValueOnce({ stdout: "throttled=0x0\n" });
    const status = await getThrottleStatus();
    expect(status).toEqual({
      supported: true,
      undervoltage: false,
      throttled: false,
      temperatureLimit: false,
      undervoltageOccurred: false,
      throttledOccurred: false,
      temperatureLimitOccurred: false,
    });
  });

  it("decodes current undervoltage and past throttling from the bitmask", async () => {
    // bit 0 (undervoltage now) + bit 18 (throttling occurred)
    mockExecAsync.mockResolvedValueOnce({ stdout: "throttled=0x40001\n" });
    const status = await getThrottleStatus();
    expect(status.supported).toBe(true);
    expect(status.undervoltage).toBe(true);
    expect(status.throttled).toBe(false);
    expect(status.throttledOccurred).toBe(true);
  });

  it("reports unsupported when vcgencmd is unavailable", async () => {
    mockExecAsync.mockRejectedValueOnce(new Error("command not found"));
    const status = await getThrottleStatus();
    expect(status.supported).toBe(false);
  });
});
