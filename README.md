# fast-proxy-balancer

> Supports any proxy type compatible with `proxy-agent`, including `http`, `https`, `socks`, `socks4`, `socks5`, and PAC URLs.


![npm](https://img.shields.io/npm/v/fast-proxy-balancer?color=blue)
![license](https://img.shields.io/github/license/0xbadasya/fast-proxy-balancer)


A powerful and flexible proxy balancing library for Node.js. Designed to intelligently manage, test, and select the best proxy from a pool based on performance and reliability.

---

## 🚀 Features

- ✅ **Auto-test proxies** (latency + connectivity)
- ⚖️ **Smart selection** of best proxy
- ⏳ **Failure tolerance** and filtering
- 🔄 **Auto-refreshing** at configurable intervals
- 📊 **Detailed stats** for all proxies
- ⚙️ Extensible and easy to integrate
- 📂 Load proxies from `.txt` file or array
- 🐛 Built-in support for `proxy-agent`

---

## 📦 Installation

```bash
npm install fast-proxy-balancer
```

---

## 💻 Quick Start

```js
import { ProxyBalancer } from 'fast-proxy-balancer';

// Option 1: Load from array
const balancer = new ProxyBalancer([
  'http://proxy1.com',
  'http://proxy2.com'
], options);

// Option 2: Load from file (each proxy URL on a new line)
const balancer = new ProxyBalancer('./proxies.txt', options);

await balancer.init();
await balancer.refreshProxies();

const best = await balancer.getBestProxy();
console.log('Best proxy:', best.url);
```

> 💡 Proxy file should be a plain `.txt` file, one proxy URL per line. Lines starting with `#` are ignored as comments.

---

## 🔧 Constructor Options

| Option            | Type     | Default              | Description                                          |
|-------------------|----------|----------------------|------------------------------------------------------|
| `maxFailures`     | number   | `3`                  | Max allowed failures before excluding a proxy        |
| `testTimeout`     | number   | `5000`               | Timeout (ms) for testing proxy connectivity          |
| `refreshInterval` | number   | `60000`              | Interval (ms) for automatic proxy re-testing         |
| `concurrentTests` | number   | `5`                  | Number of proxies to test in parallel                |
| `testUrl`         | string   | `'https://example.com'` | URL used to test proxies                         |
| `proxyListOrFile` | array or string | Required       | List of proxy URLs or path to a file with proxies    |

---

## 📊 API Reference

### `await balancer.init()`
Initializes the proxy list. Must be called after instantiation.

### `await balancer.refreshProxies()`
Tests all proxies concurrently, updating their latency and failure count.

### `await balancer.getBestProxy()`
Returns the most optimal proxy based on latency and reliability:
```js
{
  url: 'http://proxy2.com',
  agent: ProxyAgentInstance
}
```

### `balancer.getProxyStats()`
Returns detailed information about all proxies:
```js
[
  {
    url: 'http://proxy1.com',
    latency: '512 ms',
    failures: 0,
    lastUsed: '2025-04-03 23:22:01'
  },
  ...
]
```

### `balancer.sortByLatency()`
Returns all available proxies sorted by best latency.

### `balancer.getFailedProxies()`
Returns all proxies that exceeded the `maxFailures` threshold.

### `balancer.getStatsSummary()`
Returns an overview of the current proxy pool:
```js
{
  total: 5,
  active: 4,
  failed: 1,
  avgLatency: '421 ms'
}
```

### `balancer.startAutoRefresh()`
Starts automatic proxy testing at intervals defined by `refreshInterval`.

---

## 🧪 Testing & Coverage (planned)

Unit tests will be added to cover:

- Proxy testing logic (latency, failure counting)
- Sorting, filtering and selection
- Stats aggregation and summaries
- Edge cases (timeouts, invalid URLs, empty lists)

> Testing framework: **Jest** with **babel-jest**
> Planned coverage: 90%+ on all core components

---

## 🚧 Planned Features

- [ ] Web dashboard with live status view
- [ ] Web dashboard with live status view
- [ ] Integration with Redis / database for distributed setups
- [ ] Event hooks: `onProxyFail`, `onProxyRecovered`, etc.
- [ ] CLI tool for manual usage
- [ ] Auto-persistence of results to disk or JSON

---

## 📁 Project Structure

- `src/` - Core library files
- `test/` - Manual or automated test files
- `proxy.log` - Log file output (optional)

---

## 📘 Contributing Guide (`CONTRIBUTING.md`)

---

## 📜 Changelog (`CHANGELOG.md`)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-04-03
### Added
- Initial release of fast-proxy-balancer
- Proxy list loading from array or file
- Auto-testing and failure tracking
- Best proxy selection and latency sorting
- Proxy stats, summaries, and failed proxy filtering

### Fixed
- Compatibility with proxy-agent v6
```

---

## ⚙️ .npmrc

```ini
save-exact=true
loglevel=warn
```


```markdown
# Contributing to fast-proxy-balancer

We welcome contributions of all kinds! Here’s how you can help:

## 🛠 Fix a Bug / Submit a Feature
- Fork the repo and create your branch (`git checkout -b feature/my-feature`)
- Commit your changes with a clear message
- Open a pull request and describe what you did

## 📦 Install Locally
```bash
npm install
npm run dev # or a test command
```

## 💡 Coding Style
- Use consistent formatting (Prettier / ESLint preferred)
- Add comments where needed for clarity

## 🧪 Add Tests (optional but appreciated!)

Thanks for helping us build better proxy tools!
```

---

## 📜 Changelog Template (`CHANGELOG.md`)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-04-03
### Added
- Initial release
- Proxy testing, selection, and auto-refresh
- Stats, summaries, and failure tracking

### Fixed
- ProxyAgent compatibility with v6

```

---

---

## 📦 Final Notes

- ✅ Supports **any proxy type** that `proxy-agent` can handle:
  - `http://`, `https://`
  - `socks://`, `socks4://`, `socks5://`
  - PAC files and custom proxy protocols
- 🌐 Works seamlessly with authenticated proxies (via user:pass in the URL)

---

## 📦 package.json

```json
{
  "name": "fast-proxy-balancer",
  "version": "1.0.0",
  "main": "ProxyBalancer.js",
  "type": "module",
  "scripts": {
    "test": "jest"
  },
  "keywords": [],
  "author": "badasya",
  "license": "ISC",
  "description": "Smart and flexible proxy balancer for Node.js",
  "devDependencies": {
    "@babel/core": "^7.26.10",
    "@babel/preset-env": "^7.26.9",
    "babel-jest": "^29.7.0",
    "jest": "^29.7.0"
  },
  "dependencies": {
    "axios": "^1.8.4",
    "https-proxy-agent": "^7.0.6",
    "proxy-agent": "^6.5.0"
  }
}
```

---

## 📦 npm Config (`.npmrc`)

```ini
save-exact=true
loglevel=warn
```

---

## 📃 License

MIT

---

## 💪 Author

Built by badasya — PRs and stars welcome ⭐

