import si from "systeminformation";

export interface TemperaturePoint {
  timestamp: number;
  value: number;
}

const SAMPLE_INTERVAL_MS = 10_000;
const MAX_POINTS = 180; // 30 minutes at 10s intervals

const history: TemperaturePoint[] = [];

async function sample() {
  const temp = await si.cpuTemperature();
  if (temp.main >= 0) {
    history.push({ timestamp: Date.now(), value: Math.round(temp.main * 10) / 10 });
    if (history.length > MAX_POINTS) history.shift();
  }
}

export function startTemperatureHistory() {
  void sample();
  setInterval(() => void sample(), SAMPLE_INTERVAL_MS);
}

export function getTemperatureHistory(): TemperaturePoint[] {
  return history;
}
