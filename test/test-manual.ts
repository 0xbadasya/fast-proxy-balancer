import { ProxyBalancer } from '../src/ProxyBalancer.js';
import type { Proxy } from '../src/interfaces/interfaces.js';
import { log } from '../src/utils/logger.js';

// Mock testProxy function
async function mockTestProxy(proxy: Proxy, testUrl: string, timeout: number): Promise<void> {
  console.log('🧪 mockTestProxy called:', proxy.url);
  proxy.latency = Math.floor(Math.random() * 200);
  proxy.failures = 0;
}

// Mock sortProxies function
function mockSortProxies(proxies: Proxy[]): Proxy[] {
  console.log('📊 mockSortProxies called');
  return proxies.sort((a, b) => a.latency - b.latency); // Simple sort for testing
}

// Extend ProxyBalancer to inject mocks
class MockProxyBalancer extends ProxyBalancer {
  override async refreshProxies(): Promise<void> {
    console.log('🔁 Using mock refreshProxies...');
    const promises = this['proxies'].map((proxy: Proxy) => mockTestProxy(proxy, '', 0));
    await Promise.all(promises);
  }

  override getBestProxy = ProxyBalancer.prototype.getBestProxy;

  override ['proxies']: Proxy[] = [];
}

// Manual test run
async function testManual(): Promise<void> {
  const proxyBalancer = new MockProxyBalancer([
    'http://proxy1.com',
    'http://proxy2.com',
    'http://proxy3.com'
  ]);

  console.log('🚀 Initializing...');
  await proxyBalancer.init();

  try {
    await proxyBalancer.refreshProxies();
    console.log('✅ Proxies refreshed');

    const bestProxy = await proxyBalancer.getBestProxy();
    console.log('🏆 Best Proxy:', bestProxy.url);
  } catch (error) {
    console.error('❌ Error during refresh or best proxy selection:', error);
  }

  console.log('📊 Proxy stats:');
  console.table(proxyBalancer.getProxyStats());

  console.log('📌 Sorted by latency:');
  console.table(proxyBalancer.sortByLatency());

  console.log('❌ Failed proxies:');
  console.table(proxyBalancer.getFailedProxies());

  console.log('📉 Summary:');
  console.log(proxyBalancer.getStatsSummary());
}

testManual();
