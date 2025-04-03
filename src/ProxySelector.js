function sortProxies(proxies) {
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

export { sortProxies };
