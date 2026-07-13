import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export interface ThrottleStatus {
  supported: boolean;
  undervoltage: boolean;
  throttled: boolean;
  temperatureLimit: boolean;
  undervoltageOccurred: boolean;
  throttledOccurred: boolean;
  temperatureLimitOccurred: boolean;
}

const UNSUPPORTED: ThrottleStatus = {
  supported: false,
  undervoltage: false,
  throttled: false,
  temperatureLimit: false,
  undervoltageOccurred: false,
  throttledOccurred: false,
  temperatureLimitOccurred: false,
};

// vcgencmd get_throttled prints a bitmask, eg. "throttled=0x50000".
// See: https://www.raspberrypi.com/documentation/computers/os.html#get_throttled
export async function getThrottleStatus(): Promise<ThrottleStatus> {
  try {
    const { stdout } = await execAsync("vcgencmd get_throttled");
    const match = /0x([0-9a-fA-F]+)/.exec(stdout);
    if (!match) return UNSUPPORTED;
    const flags = parseInt(match[1], 16);

    return {
      supported: true,
      undervoltage: (flags & 0x1) !== 0,
      throttled: (flags & 0x4) !== 0,
      temperatureLimit: (flags & 0x8) !== 0,
      undervoltageOccurred: (flags & 0x10000) !== 0,
      throttledOccurred: (flags & 0x40000) !== 0,
      temperatureLimitOccurred: (flags & 0x80000) !== 0,
    };
  } catch {
    return UNSUPPORTED;
  }
}
