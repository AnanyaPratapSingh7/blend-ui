# Blend Markets & Pool Dashboard

A beautiful, intuitive Next.js web application for the Blend lending protocol on Stellar. This application provides both a markets overview page and detailed pool dashboards with real-time data, user positions, and integrated AI assistance.

## 🌟 Features

### Markets Overview Page

- **Markets Dashboard**: Overview of all available lending pools
- **Pool Comparison**: Side-by-side comparison of different pools
- **Sorting & Filtering**: Sort pools by TVL, APY, utilization, and risk level
- **Market Metrics**: Total value locked, borrowed amounts, and utilization rates
- **Pool Cards**: Interactive cards showing key metrics for each pool
- **Pool Navigation**: Click on any pool to view detailed dashboard

### Individual Pool Dashboard

- **Real-time Pool Data**: Live TVL, utilization rates, APY, and backstop metrics
- **Beautiful UI**: Modern Material-UI design with dark theme and smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Charts**: Pie charts, line graphs, and bar charts for data visualization
- **Multi-tab Interface**: Organized sections for Overview, Assets, Positions, Transactions, and Analytics

### Transaction Management

- **Multi-step Transaction Flow**: Supply, Withdraw, Borrow, Repay with confirmation steps
- **Real-time Calculations**: Live interest calculations and health factor updates
- **Risk Assessment**: Visual warnings and safety checks before transactions
- **Gas Fee Estimation**: Accurate transaction cost predictions

### AI Assistant

- **Intelligent Help**: Context-aware AI assistant that answers DeFi questions
- **Guided Onboarding**: Step-by-step tutorials for new users
- **Real-time Chat**: Instant responses to user queries about pools and strategies
- **Educational Content**: Explains complex DeFi concepts in simple terms

### User Experience

- **Welcome Flow**: Comprehensive onboarding for new users
- **Pool Comparison**: Side-by-side comparison of different lending pools
- **Visual Feedback**: Loading states, success/error messages, and progress indicators
- **Accessibility**: Full keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Stellar wallet (Freighter recommended)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd blend-ui-1
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Architecture

### Components Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── PoolDashboard.tsx      # Main dashboard component
│   │   ├── AIAssistant.tsx        # AI chat assistant
│   │   ├── TransactionModal.tsx   # Transaction flow
│   │   ├── WelcomeModal.tsx       # Onboarding flow
│   │   └── PoolCompare.tsx        # Pool comparison
│   ├── common/                    # Reusable UI components
│   └── ...
├── pages/
│   ├── index.tsx                  # Main application entry
│   └── ...
├── hooks/                         # Custom React hooks
├── utils/                         # Utility functions
└── contexts/                      # React contexts
```

### Key Features Implementation

#### 1. Pool Dashboard

- Fetches real-time data from Blend protocol
- Displays key metrics with beautiful cards and charts
- Provides quick actions for all lending operations
- Shows detailed asset information and utilization

#### 2. AI Assistant

- Contextual help based on current pool data
- Pre-built responses for common DeFi questions
- Educational content for new users
- Floating chat interface with minimize/maximize

#### 3. Transaction Flow

- Multi-step process with confirmation
- Real-time calculations and validations
- Risk assessment and safety warnings
- Integration with Stellar wallet

#### 4. Pool Comparison

- Side-by-side comparison of multiple pools
- Filtering and search capabilities
- Risk scoring and performance metrics
- Easy pool switching

## 📊 Data Sources

- **Blend Protocol**: Real-time lending pool data
- **Stellar Network**: Transaction and account information
- **Mock Data**: Sample data for demonstration (charts, transactions)

## 🎨 Design System

### Color Palette

- **Primary**: #36B04A (Green) - Supply actions
- **Secondary**: #FF3366 (Red) - Withdraw actions
- **Warning**: #FF8A00 (Orange) - Borrow actions
- **Success**: #2775C9 (Blue) - Repay actions
- **Background**: #191B1F (Dark) - Main background

### Typography

- **Font Family**: DM Sans
- **Headings**: Bold weights for hierarchy
- **Body Text**: Regular and medium weights
- **Monospace**: For addresses and transaction hashes

## 🔧 Configuration

### Environment Variables

```bash
NEXT_PUBLIC_PASSPHRASE=Public Global Stellar Network ; September 2015  # Mainnet
# NEXT_PUBLIC_PASSPHRASE=Test SDF Network ; September 2015              # Testnet
```

### Pool Configuration

The app defaults to the most active Blend pool:

```typescript
const poolId = 'CCLBPEYS3XFK65MYYXSBMOGKUI4ODN5S7SUZBGD7NALUQF64QILLX5B5';
```

## 📱 Mobile Responsiveness

- Responsive breakpoints for all screen sizes
- Touch-friendly interface elements
- Optimized charts and tables for mobile
- Swipe gestures for navigation

## 🔐 Security Features

- Read-only by default (no wallet connection required for viewing)
- Secure wallet integration with Freighter
- Transaction confirmation steps
- Risk warnings and safety checks
- No private key handling

## 🎯 Future Enhancements

- [ ] Real AI integration (OpenAI API)
- [ ] Advanced analytics and historical data
- [ ] Portfolio tracking across multiple pools
- [ ] Price alerts and notifications
- [ ] Social features (sharing positions)
- [ ] Multi-language support
- [ ] Advanced trading strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Blend Protocol team for the excellent lending infrastructure
- Stellar Development Foundation for the robust blockchain platform
- Material-UI team for the beautiful component library
- React and Next.js communities for the amazing frameworks

---

**Built with ❤️ for the Stellar DeFi ecosystem**

## 🛣️ Routing Structure

### Pages

- **`/`** - Home page (redirects to `/markets`)
- **`/markets`** - Markets overview page showing all pools
- **`/pool/[poolId]`** - Individual pool dashboard page

### Navigation Flow

1. **Markets Page** (`/markets`) - Browse all available lending pools
2. **Click on Pool** - Navigate to specific pool dashboard
3. **Pool Dashboard** (`/pool/[poolId]`) - Detailed view of selected pool

The application now follows the standard DeFi pattern where users first see a markets overview and then can drill down into specific pools for detailed information and transactions
