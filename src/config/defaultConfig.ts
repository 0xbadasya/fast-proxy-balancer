export interface ProxyBalancerConfig {
  maxFailures: number;
  testTimeout: number;
  refreshInterval: number;
  testUrl: string;
}

export const defaultConfig: ProxyBalancerConfig = {
  maxFailures: 3,
  testTimeout: 5000,
  refreshInterval: 60000,
  testUrl: 'https://example.com'
};
