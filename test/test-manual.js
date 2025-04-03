import { ProxyBalancer } from '../src/ProxyBalancer.js';

// Create simple dummy functions instead of mocks
function mockTestProxy() {
  console.log('mockTestProxy called');
  return Promise.resolve({ url: 'http://proxy1.com', latency: 100 });
}

function mockSortProxies(proxies) {
  console.log('mockSortProxies called');
  return proxies; // Just return the passed array unchanged
}

function mockLog(message) {
  console.log('mockLog called:', message);
}

// Replace functions with dummy functions
global.testProxy = mockTestProxy;
global.sortProxies = mockSortProxies;
global.log = mockLog;

async function testManual() {
  const proxyBalancer = new ProxyBalancer(['http://proxy1.com', 'http://proxy2.com']);

  console.log("Initializing ProxyBalancer...");
  await proxyBalancer.init(); 

  try {
    await proxyBalancer.refreshProxies();
    console.log("Proxies refreshed");

    const bestProxy = await proxyBalancer.getBestProxy();
    console.log("Best Proxy: ", bestProxy);
  } catch (error) {
    console.error("Error during refresh or best proxy selection:", error);
  }


  const stats = proxyBalancer.getProxyStats();
  console.log("📊 Proxy stats:");
  console.table(stats);

  console.log("📌 Sorted by latency:");
  console.table(proxyBalancer.sortByLatency());

  console.log("❌ Failed proxies:");
  console.table(proxyBalancer.getFailedProxies());

  console.log("📉 Summary:");
  console.log(proxyBalancer.getStatsSummary());
}

// Start test manually
testManual();
