import axios from 'axios';
import { log } from './utils/logger.js';

async function testProxy(proxy, testUrl, testTimeout) {
  log(`Testing proxy: ${proxy.url}`);
  const start = Date.now();
  try {
    const { default: proxyAgentDefault } = await import('proxy-agent');
    const createProxyAgent = proxyAgentDefault.ProxyAgent;
    const agent = new createProxyAgent(proxy.url); 

    const response = await axios.get(testUrl, {
      timeout: testTimeout,
      httpAgent: agent,
      httpsAgent: agent
    });

    if (response.status !== 200) {
      throw new Error(`Proxy failed with status: ${response.status}`);
    }

    proxy.latency = Date.now() - start;
    proxy.failures = 0;
    log(`✅ Proxy ${proxy.url} passed with latency: ${proxy.latency}ms`);
  } catch (err) {
    proxy.failures += 1;
    proxy.latency = Infinity;
    log(`❌ Proxy ${proxy.url} failed. Errors: ${proxy.failures}`, 'error');
    if (err.response) {
      log(`Response error: ${err.response.status}`, 'error');
    } else if (err.request) {
      log('No response received from proxy', 'error');
    } else {
      log(`Error: ${err.message}`, 'error');
    }
  }
}

export { testProxy };
