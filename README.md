# Blend UI

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Blend Protocol](https://img.shields.io/badge/Blend-Protocol-blueviolet)](https://blend.capital)
[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-0a6cff)](https://stellar.org)

> **The premier open-source dashboard for the Blend Protocol on Stellar.**
> 
> Supply, borrow, and manage your DeFi assets with institutional-grade security, real-time analytics, and a beautiful, intuitive interface.

---

## 🚀 What is Blend UI?

**Blend UI** is a modern, open-source web application for interacting with the [Blend Protocol](https://blend.capital) — Stellar's most trusted decentralized lending platform. Blend UI lets you:

- **Supply** assets and earn competitive yields
- **Borrow** against your crypto collateral
- **Track** your positions and pool performance in real time
- **Learn** with an integrated AI assistant and guided onboarding
- **Enjoy** a seamless, secure, and beautiful DeFi experience

---

## 🌟 Features

- **Markets Dashboard**: Overview of all available lending pools with live metrics
- **Pool Comparison**: Side-by-side comparison of pools by TVL, APY, utilization, and risk
- **Real-Time Data**: Live updates for TVL, APY, utilization, and backstop metrics
- **Multi-step Transactions**: Supply, withdraw, borrow, and repay with confirmations and safety checks
- **AI Assistant**: Context-aware help, DeFi education, and onboarding guidance
- **Beautiful UI**: Modern Material-UI design, dark mode, and smooth animations
- **Mobile Responsive**: Optimized for all devices
- **Security First**: Audited contracts, wallet integration, and risk warnings
- **Accessibility**: Full keyboard navigation and screen reader support

---

## 🧑‍💻 Quickstart

### Prerequisites
- Node.js 18+
- npm or yarn
- Stellar wallet (Freighter recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/blend-capital/blend-ui.git
cd blend-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Network Builds

- **Testnet:**
  - Edit `.env.testnet` as needed
  - `npm run build:testnet`
- **Mainnet:**
  - Edit `.env.production` as needed
  - `npm run build:mainnet`

### IPFS Deployment
Each release is automatically deployed to IPFS. See the [Releases page](https://github.com/blend-capital/blend-ui/releases) for the latest version.

---

## 🏦 How Blend Works

1. **Supply Assets**: Deposit supported tokens to earn interest
2. **Borrow**: Use your supplied assets as collateral to borrow other tokens
3. **Repay & Withdraw**: Repay loans anytime and withdraw your collateral
4. **AI Assistant**: Get real-time help, onboarding, and DeFi education

**Interest rates are dynamic** and adjust based on supply and demand. The protocol is non-custodial and fully decentralized.

---

## 🖥️ Architecture

```
src/
├── components/
│   ├── dashboard/         # Pool dashboards, AI assistant, onboarding
│   ├── common/            # Reusable UI components
│   ├── ...
├── pages/                 # Next.js pages (markets, pool, user, etc.)
├── hooks/                 # Custom React hooks for data fetching
├── utils/                 # Utility functions
├── contexts/              # React contexts (wallet, settings, etc.)
```

- **Real-time data** from Blend Protocol and Stellar Network
- **Transaction flows** with live calculations and risk checks
- **AI assistant** for onboarding and DeFi Q&A
- **Responsive, accessible, and beautiful** by design

---

## ⚙️ Configuration

### Environment Variables

```bash
NEXT_PUBLIC_PASSPHRASE=Public Global Stellar Network ; September 2015  # Mainnet
# NEXT_PUBLIC_PASSPHRASE=Test SDF Network ; September 2015              # Testnet
```

- Edit `.env.testnet` or `.env.production` for your deployment
- The app defaults to the most active Blend pool:

```typescript
const poolId = 'CCLBPEYS3XFK65MYYXSBMOGKUI4ODN5S7SUZBGD7NALUQF64QILLX5B5';
```

---

## 🔐 Security & Safety

- **Read-only by default**: No wallet required to browse
- **Secure wallet integration**: Freighter and other Stellar wallets
- **Transaction confirmations**: Multi-step flows with risk warnings
- **No private key handling**: All signing is done in your wallet
- **Audited contracts**: Blend Protocol is security-audited
- **Safety tips**: Built-in onboarding and risk education

---

## 🤖 AI Assistant & Onboarding

- **Guided onboarding**: Step-by-step welcome flow for new users
- **AI chat**: Ask DeFi questions, get help, and learn as you go
- **Pro tips**: Contextual advice and safety reminders
- **Educational content**: Learn about lending, borrowing, and risk management

---

## 📱 Mobile & Accessibility

- Fully responsive for all devices
- Touch-friendly and optimized for mobile
- Keyboard navigation and screen reader support

---

## 🛠️ Contributing

We welcome contributions from the community!

1. Fork the repository
2. Create a feature branch
3. Make your changes and test thoroughly
4. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) if available, or open an issue to get started.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Blend Protocol](https://blend.capital) team for the protocol and infrastructure
- [Stellar Development Foundation](https://stellar.org) for the blockchain platform
- [Material-UI](https://mui.com) for the component library
- [React](https://react.dev) and [Next.js](https://nextjs.org) for the frameworks

---

## 🌐 Links & Community

- [Blend Protocol Docs](https://docs.blend.capital/)
- [Blend App](https://blend.capital)
- [Stellar Network](https://stellar.org)
- [Blend UI Releases](https://github.com/blend-capital/blend-ui/releases)
- [Blend Protocol GitHub](https://github.com/blend-capital)
- [Join the Blend Discord](https://discord.gg/blend)

---

**Built with ❤️ for the Stellar DeFi ecosystem.**
