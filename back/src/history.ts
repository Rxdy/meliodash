import si from "systeminformation";

export interface HistoryPoint {
  timestamp: number;
  value: number;
}

export interface History {
  cpu: HistoryPoint[];
  memory: HistoryPoint[];
  temperature: HistoryPoint[];
  networkRx: HistoryPoint[];
  networkTx: HistoryPoint[];
}

const SAMPLE_INTERVAL_MS = 3_000;
const MAX_POINTS = 100; // 5 minutes at 3s intervals

const history: History = {
  cpu: [],
  memory: [],
  temperature: [],
  networkRx: [],
  networkTx: [],
};

function push(buffer: HistoryPoint[], value: number) {
  buffer.push({ timestamp: Date.now(), value });
  if (buffer.length > MAX_POINTS) buffer.shift();
}

async function sample() {
  const [load, mem, temp, net] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.cpuTemperature(),
    si.networkStats(),
  ]);

  push(history.cpu, Math.round(load.currentLoad * 10) / 10);
  push(history.memory, Math.round((mem.active / mem.total) * 1000) / 10);
  if (temp.main >= 0) {
    push(history.temperature, Math.round(temp.main * 10) / 10);
  }

  const primary = net[0];
  if (primary) {
    push(history.networkRx, Math.round(primary.rx_sec ?? 0));
    push(history.networkTx, Math.round(primary.tx_sec ?? 0));
  }
}

export function startHistory() {
  void sample();
  setInterval(() => void sample(), SAMPLE_INTERVAL_MS);
}

export function getHistory(): History {
  return history;
}
