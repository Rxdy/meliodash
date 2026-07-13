import si from "systeminformation";
import { getHistory, type History } from "./history.js";
import { getThrottleStatus, type ThrottleStatus } from "./throttle.js";

export interface Metrics {
  timestamp: number;
  uptimeSeconds: number;
  throttle: ThrottleStatus;
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
  history: History;
}

// Pseudo/virtual filesystems that show up as "disks" but carry no useful
// storage info (efivarfs is a fixed few-hundred-byte NVRAM store that always
// reads as ~100% full, tmpfs/overlay/proc/sysfs are in-memory or virtual).
const IGNORED_FS_TYPES = new Set([
  "efivarfs",
  "tmpfs",
  "devtmpfs",
  "overlay",
  "squashfs",
  "proc",
  "sysfs",
  "cgroup",
  "cgroup2",
  "debugfs",
  "tracefs",
  "pstore",
  "bpf",
  "mqueue",
  "hugetlbfs",
  "autofs",
  "binfmt_misc",
  "rpc_pipefs",
  "nsfs",
  "fusectl",
  "configfs",
  "securityfs",
]);

function isRelevantDisk(disk: si.Systeminformation.FsSizeData) {
  if (IGNORED_FS_TYPES.has(disk.type)) return false;
  // boot partitions (EFI system partition, Raspberry Pi's /boot/firmware, ...)
  // are real but not what "disk usage" means for this dashboard.
  if (disk.mount.startsWith("/boot")) return false;
  if (disk.mount.startsWith("/sys")) return false;
  return true;
}

// Docker bind-mounts (/etc/resolv.conf, /etc/hostname, ...) show up as extra
// entries pointing at the same underlying filesystem; keep one per (size, used).
function dedupeDisks(disks: si.Systeminformation.FsSizeData[]) {
  const seen = new Map<string, si.Systeminformation.FsSizeData>();
  for (const disk of disks.filter(isRelevantDisk)) {
    const key = `${disk.size}:${disk.used}`;
    const existing = seen.get(key);
    if (!existing || disk.mount.length < existing.mount.length) {
      seen.set(key, disk);
    }
  }
  return [...seen.values()];
}

export async function getMetrics(): Promise<Metrics> {
  const [load, mem, temp, fsSize, netStats, time, throttle] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.cpuTemperature(),
    si.fsSize(),
    si.networkStats(),
    si.time(),
    getThrottleStatus(),
  ]);

  return {
    timestamp: Date.now(),
    uptimeSeconds: time.uptime,
    throttle,
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
    disks: dedupeDisks(fsSize).map((d) => ({
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
    history: getHistory(),
  };
}
