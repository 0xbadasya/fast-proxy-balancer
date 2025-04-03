import { testProxy } from './ProxyTester.js';
import { sortProxies } from './ProxySelector.js';
import { loadProxiesFromFile } from './utils/loadProxy.js';
import { log } from './utils/logger.js'; 

class ProxyBalancer {
  constructor(proxyListOrFile, options = {}) {
    this.logger = { log: console.log };  
    this.proxyListOrFile = proxyListOrFile;
    this.options = options;

    this.proxies = [];
    this.maxFailures = options.maxFailures || 3;
    this.testTimeout = options.testTimeout || 5000;
    this.refreshInterval = options.refreshInterval || 60000;
    this.concurrentTests = options.concurrentTests || 5; 
    this.testUrl = options.testUrl || 'https://example.com';
  }

  async init() {
    const proxyListOrFile = this.proxyListOrFile;
  
    if (typeof proxyListOrFile === 'string') {
      log(`Loading proxies from file: ${proxyListOrFile}`);
      this.proxies = (await loadProxiesFromFile(proxyListOrFile)).map(url => ({
        url,
        latency: Infinity,
        failures: 0,
        lastUsed: 0
      }));
    } else if (Array.isArray(proxyListOrFile)) {
      log('Loading proxies from array');
      this.proxies = proxyListOrFile.map(url => ({
        url,
        latency: Infinity,
        failures: 0,
        lastUsed: 0
      }));
    } else {
      throw new Error('Invalid proxy source: must be a file path or an array');
    }
  }

  async refreshProxies() {
    log('Refreshing proxies...');
    
    const promises = this.proxies.map((proxy, index) => 
      new Promise(resolve => setTimeout(async () => {
        try {
          await testProxy(proxy, this.testUrl, this.testTimeout);
        } catch (error) {
          log(`Error testing proxy ${proxy.url}: ${error.message}`, 'error');
        }
        resolve();
      }, (index % this.concurrentTests) * 500)) // Limitations of simultaneous tests
    );

    await Promise.all(promises);
    log('Proxy refresh completed');
  }

  async getBestProxy() {
    if (this.proxies.length === 0) throw new Error('No proxies available');
  
    this.proxies = sortProxies(this.proxies);
  
    const availableProxies = this.proxies.filter(p => p.failures < this.maxFailures);
    if (availableProxies.length === 0) {
      throw new Error('All proxies have exceeded the max failure threshold');
    }
  
    const bestProxy = availableProxies[0];
    bestProxy.lastUsed = Date.now();
  
    const { default: proxyAgentDefault } = await import('proxy-agent');
    const createProxyAgent = proxyAgentDefault.ProxyAgent;
  
    log(`Best proxy selected: ${bestProxy.url}`);
    return {
      url: bestProxy.url,
      agent: new createProxyAgent(bestProxy.url)
    };
  }

  startAutoRefresh() {
    setInterval(() => this.refreshProxies(), this.refreshInterval);
  }

  getProxyStats() {
    if (!this.proxies.length) return [];
  
    return this.proxies.map(proxy => ({
      url: proxy.url,
      latency: isFinite(proxy.latency) ? `${proxy.latency} ms` : 'N/A',
      failures: proxy.failures,
      lastUsed: proxy.lastUsed
        ? new Date(proxy.lastUsed).toLocaleString()
        : 'Never used'
    }));
  }
  
  sortByLatency() {
    const sorted = this.proxies
      .filter(p => p.failures < this.maxFailures && isFinite(p.latency))
      .sort((a, b) => a.latency - b.latency);
  
    return sorted.map(proxy => ({
      url: proxy.url,
      latency: `${proxy.latency} ms`,
      failures: proxy.failures,
      lastUsed: proxy.lastUsed
        ? new Date(proxy.lastUsed).toLocaleString()
        : 'Never used'
    }));
  }
  
  getFailedProxies() {
    const failed = this.proxies.filter(p => p.failures >= this.maxFailures);
  
    return failed.map(proxy => ({
      url: proxy.url,
      latency: isFinite(proxy.latency) ? `${proxy.latency} ms` : 'N/A',
      failures: proxy.failures,
      lastUsed: proxy.lastUsed
        ? new Date(proxy.lastUsed).toLocaleString()
        : 'Never used'
    }));
  }
  
  getStatsSummary() {
    const total = this.proxies.length;
    const active = this.proxies.filter(p => p.failures < this.maxFailures);
    const failed = total - active.length;
  
    const avgLatency =
      active.length > 0
        ? Math.round(
            active.reduce((sum, p) => sum + (isFinite(p.latency) ? p.latency : 0), 0) /
              active.length
          )
        : null;
  
    return {
      total,
      active: active.length,
      failed,
      avgLatency: avgLatency !== null ? `${avgLatency} ms` : 'N/A'
    };
  }  

}

export { ProxyBalancer };