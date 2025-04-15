# fast-proxy-balancer

> TypeScript-ready, fast, and extensible proxy balancer using `proxy-agent`. Supports all proxy types: `http`, `https`, `socks`, PAC, and more.

![npm](https://img.shields.io/npm/v/fast-proxy-balancer?color=blue)
![license](https://img.shields.io/github/license/0xbadasya/fast-proxy-balancer)

**Smart and flexible proxy balancer for Node.js**, written in TypeScript. Automatically selects the best proxy based on performance. Built-in testing, failure handling, real-time stats, and CLI/debug tooling.

---

## 🚀 Features

- ✅ Auto-testing proxies (latency, connectivity)
- ⚖️ Smart selection based on performance
- ❌ Failure counting & exclusion logic
- 🔁 Auto-refreshing with concurrency limit
- 📊 Proxy stats, summaries, latency history
- 📂 Load from array or `.txt` file
- 🧱 Type-safe and fully written in TypeScript
- 🔌 Works with any proxy supported by `proxy-agent`

---

## 📦 Installation

```bash
npm install fast-proxy-balancer
```

---

## 💻 Quick Start

```ts
import { ProxyBalancer } from 'fast-proxy-balancer';

const balancer = new ProxyBalancer([
  'http://proxy1.com',
  'http://proxy2.com'
], {
  testUrl: 'https://example.com',
  refreshInterval: 30000
});

await balancer.init();
await balancer.refreshProxies();

const best = await balancer.getBestProxy();
console.log('🏆 Best proxy:', best.url);
```

Or load proxies from a file:

```ts
const balancer = new ProxyBalancer('./proxies.txt');
```

> 💡 Text file should contain one proxy URL per line. `#` starts a comment.

---

## 🔧 Constructor Options

| Option            | Type     | Default              | Description                                          |
|-------------------|----------|----------------------|------------------------------------------------------|
| `maxFailures`     | number   | `3`                  | Max allowed failures before excluding a proxy        |
| `testTimeout`     | number   | `5000`               | Timeout (ms) for testing proxy connectivity          |
| `refreshInterval` | number   | `60000`              | Interval (ms) for automatic proxy re-testing         |
| `concurrentTests` | number   | `5`                  | Number of proxies to test in parallel                |
| `testUrl`         | string   | `'https://example.com'` | URL used to test proxies                         |

---

## 📘 API Reference

### `await balancer.init()`
Initializes the proxy list. Call before using.

### `await balancer.refreshProxies()`
Runs latency tests, resets failures, updates metrics.

### `await balancer.getBestProxy()` → `{ url, agent }`
Returns the best proxy and its agent instance (from `proxy-agent`).

### `balancer.getProxyStats()` → `ProxyStats[]`
Detailed stats for all proxies (latency, failures, last used).

### `balancer.sortByLatency()` → `ProxyStats[]`
All proxies sorted from fastest to slowest.

### `balancer.getFailedProxies()` → `ProxyStats[]`
List of proxies that failed too often.

### `balancer.getStatsSummary()` → `{ total, active, failed, avgLatency }`
Returns overall pool summary.

### `balancer.startAutoRefresh()`
Starts background auto-refresh loop based on `refreshInterval`.

---

## 💡 Advanced Usage

### 🧠 Use with axios:

```ts
const { agent } = await balancer.getBestProxy();
const res = await axios.get('https://example.com', {
  httpAgent: agent,
  httpsAgent: agent,
  timeout: 3000
});
```

### 🧪 Manual test

```bash
npm run build && node dist/test/test-manual.js
```

---


## 🧱 Built with TypeScript

- Full `.d.ts` typings
- Exports included via `dist/index.d.ts`
- Works in strict mode with ESM

---

## 🚧 Roadmap

- [ ] Redis support for shared state
- [ ] Web dashboard (live updates)
- [ ] Event hooks: `onFail`, `onRecover`, etc.
- [ ] JSON logging/export for analytics
- [ ] Built-in CLI

---

## 📦 Final Notes

- ✅ Supports **any proxy type** that `proxy-agent` can handle:
  - `http://`, `https://`
  - `socks://`, `socks4://`, `socks5://`
  - PAC files and custom proxy protocols
- 🌐 Works seamlessly with authenticated proxies (via user:pass in the URL)

---

## 📃 License

MIT

---

## 💪 Author

MIT © [badasya](https://github.com/0xbadasya) — PRs and stars welcome ⭐
