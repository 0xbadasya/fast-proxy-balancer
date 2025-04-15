// ProxyBalances Interfaces

export interface Proxy {
    url: string;
    latency: number;
    failures: number;
    lastUsed: number;
  }
  
  export interface ProxyBalancerOptions {
    maxFailures?: number;
    testTimeout?: number;
    refreshInterval?: number;
    concurrentTests?: number;
    testUrl?: string;
  }
  
  export interface ProxyStats {
    url: string;
    latency: string;
    failures: number;
    lastUsed: string;
  }
  
  export interface ProxyAgentResult {
    url: string;
    agent: any;
  }

