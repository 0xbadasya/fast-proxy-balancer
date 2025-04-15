import type { Proxy } from './interfaces/interfaces.js';

/**
 * Sorts proxies by lowest latency first, then by fewest failures.
 * @param proxies - Array of Proxy objects
 * @returns Sorted array of proxies
 */
export function sortProxies(proxies: Proxy[]): Proxy[] {
  return proxies.slice().sort((a, b) => {
    const aLatency = isFinite(a.latency) ? a.latency : Number.MAX_VALUE;
    const bLatency = isFinite(b.latency) ? b.latency : Number.MAX_VALUE;

    const aFailures = isFinite(a.failures) ? a.failures : Number.MAX_VALUE;
    const bFailures = isFinite(b.failures) ? b.failures : Number.MAX_VALUE;

    if (aLatency !== bLatency) {
      return aLatency - bLatency;
    }

    return aFailures - bFailures;
  });
}
