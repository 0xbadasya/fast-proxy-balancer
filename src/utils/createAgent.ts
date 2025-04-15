export async function createAgent(uri: string): Promise<any> {
    const { default: proxyAgentDefault } = await import('proxy-agent');
    const Agent = proxyAgentDefault.ProxyAgent || proxyAgentDefault;
    return new (Agent as any)({ uri });
  }
  