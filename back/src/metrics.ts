import si from "systeminformation";

export interface Metrics {
  timestamp: number;
  uptimeSeconds: number;
  cpu: {
    loadPercent: number;
    cores: number;
    temperatureCelsius: number | null;
  };
  memory: {
    totalBytes: number;
    usedBytes: number;
    usedPercent: number;
  };
  disks: Array<{
    mount: string;
    sizeBytes: number;
    usedBytes: number;
    usedPercent: number;
  }>;
  network: Array<{
    iface: string;
    rxSec: number;
    txSec: number;
  }>;
}

export async function getMetrics(): Promise<Metrics> {
  const [load, mem, temp, fsSize, netStats, time] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.cpuTemperature(),
    si.fsSize(),
    si.networkStats(),
    si.time(),
  ]);

  return {
    timestamp: Date.now(),
    uptimeSeconds: time.uptime,
    cpu: {
      loadPercent: Math.round(load.currentLoad * 10) / 10,
      cores: load.cpus.length,
      temperatureCelsius: temp.main >= 0 ? Math.round(temp.main * 10) / 10 : null,
    },
    memory: {
      totalBytes: mem.total,
      usedBytes: mem.active,
      usedPercent: Math.round((mem.active / mem.total) * 1000) / 10,
    },
    disks: fsSize.map((d) => ({
      mount: d.mount,
      sizeBytes: d.size,
      usedBytes: d.used,
      usedPercent: Math.round(d.use * 10) / 10,
    })),
    network: netStats.map((n) => ({
      iface: n.iface,
      rxSec: Math.round(n.rx_sec ?? 0),
      txSec: Math.round(n.tx_sec ?? 0),
    })),
  };
}
