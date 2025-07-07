import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Switch,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Eye,
  EyeOff,
  HelpCircle,
  PiggyBank,
  Repeat,
  Settings,
  Shield,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { toBalance, toCompactAddress, toPercentage } from '../../utils/formatter';
import { TokenIcon } from '../common/TokenIcon';

interface PoolDashboardProps {
  poolData: any;
  userPositions?: any;
  onSupply?: () => void;
  onWithdraw?: () => void;
  onBorrow?: () => void;
  onRepay?: () => void;
}

const COLORS = ['#00C4EF', '#FF8A00', '#E16BFF', '#36B04A', '#2775C9', '#FFCB00'];

// Mock data for charts
const mockUtilizationData = [
  { name: 'Jan', utilization: 65, liquidity: 2500000 },
  { name: 'Feb', utilization: 72, liquidity: 2800000 },
  { name: 'Mar', utilization: 68, liquidity: 3200000 },
  { name: 'Apr', utilization: 78, liquidity: 3500000 },
  { name: 'May', utilization: 85, liquidity: 3800000 },
  { name: 'Jun', utilization: 82, liquidity: 4200000 },
];

const mockTransactionData = [
  { type: 'Supply', amount: 10000, token: 'USDC', user: 'GCK3...4A2B', timestamp: '2 mins ago' },
  { type: 'Borrow', amount: 5000, token: 'XLM', user: 'GDD2...7C8D', timestamp: '5 mins ago' },
  { type: 'Repay', amount: 2500, token: 'USDC', user: 'GEE1...9F0G', timestamp: '8 mins ago' },
  { type: 'Withdraw', amount: 7500, token: 'XLM', user: 'GFF3...1H2I', timestamp: '12 mins ago' },
  { type: 'Supply', amount: 15000, token: 'USDC', user: 'GGG4...3J4K', timestamp: '15 mins ago' },
];

export const PoolDashboard: React.FC<PoolDashboardProps> = ({
  poolData,
  userPositions,
  onSupply,
  onWithdraw,
  onBorrow,
  onRepay,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [showBalances, setShowBalances] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  if (!poolData) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading pool data...</Typography>
      </Box>
    );
  }

  const { pool, poolEst, backstopPoolEst, estBackstopApr } = poolData;

  // Calculate portfolio data for pie chart
  const portfolioData = [
    { name: 'Supplied', value: poolEst?.totalSupply || 0 },
    { name: 'Borrowed', value: poolEst?.totalBorrowed || 0 },
    { name: 'Backstop', value: backstopPoolEst?.totalSpotValue || 0 },
  ];

  const utilizationRate =
    poolEst?.totalSupply > 0 ? (poolEst.totalBorrowed / poolEst.totalSupply) * 100 : 0;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderActionButton = (
    action: string,
    icon: React.ReactNode,
    onClick?: () => void,
    color: any = 'primary'
  ) => (
    <Button
      variant="contained"
      startIcon={icon}
      onClick={onClick}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        py: 1,
        minWidth: 120,
      }}
      color={color}
    >
      {action}
    </Button>
  );

  const renderMetricCard = (
    title: string,
    value: string,
    change: string,
    icon: React.ReactNode,
    color: string
  ) => (
    <Card
      sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>{icon}</Avatar>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {change.startsWith('+') ? (
            <TrendingUp size={16} color={theme.palette.success.main} />
          ) : (
            <TrendingDown size={16} color={theme.palette.error.main} />
          )}
          <Typography
            variant="body2"
            color={change.startsWith('+') ? 'success.main' : 'error.main'}
            sx={{ ml: 0.5 }}
          >
            {change}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderAssetCard = (reserve: any, metadata: any) => (
    <Card key={reserve.assetId} sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <TokenIcon reserve={reserve} height="32px" width="32px" />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {metadata?.symbol || reserve.symbol}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metadata?.domain || toCompactAddress(reserve.assetId)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={`${toPercentage(reserve.estSupplyApy)} APY`}
              color="primary"
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${toPercentage(reserve.estBorrowApy)} Borrow`}
              color="secondary"
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Supplied
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${toBalance(reserve.totalSupplyFloat())}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Borrowed
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${toBalance(reserve.totalLiabilitiesFloat())}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Utilization Rate
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(
              100,
              (reserve.totalLiabilitiesFloat() / reserve.totalSupplyFloat()) * 100
            )}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {pool.metadata.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Pool ID: {toCompactAddress(pool.id)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label="Active" color="success" size="small" />
            <Chip label="Verified" color="primary" size="small" />
            <Chip label={`${pool.reserves.size} Assets`} variant="outlined" size="small" />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={showBalances}
                onChange={(e) => setShowBalances(e.target.checked)}
                size="small"
              />
            }
            label={showBalances ? <Eye size={16} /> : <EyeOff size={16} />}
          />
          <Tooltip title="Pool Settings">
            <IconButton>
              <Settings size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Help & FAQ">
            <IconButton>
              <HelpCircle size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            'Total Value Locked',
            showBalances ? `$${toBalance(poolEst?.totalSupply)}` : '****',
            '+12.5%',
            <DollarSign size={20} />,
            theme.palette.primary.main
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            'Total Borrowed',
            showBalances ? `$${toBalance(poolEst?.totalBorrowed)}` : '****',
            '+8.3%',
            <CreditCard size={20} />,
            theme.palette.secondary.main
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            'Utilization Rate',
            `${utilizationRate.toFixed(2)}%`,
            '+2.1%',
            <Activity size={20} />,
            theme.palette.warning.main
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            'Backstop APR',
            `${toPercentage(estBackstopApr)}`,
            '+0.8%',
            <Shield size={20} />,
            theme.palette.success.main
          )}
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {renderActionButton('Supply', <PiggyBank size={18} />, onSupply, 'primary')}
        {renderActionButton('Withdraw', <ArrowUpRight size={18} />, onWithdraw, 'secondary')}
        {renderActionButton('Borrow', <CreditCard size={18} />, onBorrow, 'warning')}
        {renderActionButton('Repay', <Repeat size={18} />, onRepay, 'success')}
      </Box>

      {/* Main Content Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Overview" />
            <Tab label="Assets" />
            <Tab label="My Positions" />
            <Tab label="Transactions" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <CardContent sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {/* Portfolio Distribution */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Portfolio Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Grid>

              {/* Utilization Trend */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Utilization Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockUtilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Line type="monotone" dataKey="utilization" stroke="#00C4EF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Grid>

              {/* Pool Statistics */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Pool Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary">
                        {pool.reserves.size}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Assets
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="secondary">
                        {pool.metadata.maxPositions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Max Positions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="success.main">
                        $1.2M
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Insurance Fund
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="warning.main">
                        24h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg. Response Time
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Assets in Pool
              </Typography>
              {Array.from(pool.reserves.values()).map((reserve) =>
                renderAssetCard(reserve, { symbol: reserve.symbol, domain: 'stellar.org' })
              )}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                My Positions
              </Typography>
              {userPositions ? (
                <Grid container spacing={2}>
                  {/* User positions would go here */}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="body1" color="text.secondary">
                          Connect your wallet to view your positions
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Card>
                  <CardContent>
                    <Typography variant="body1" color="text.secondary">
                      Connect your wallet to view your positions
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              {mockTransactionData.map((tx, index) => (
                <Card key={index} sx={{ mb: 1 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={tx.type}
                          color={
                            tx.type === 'Supply'
                              ? 'primary'
                              : tx.type === 'Borrow'
                              ? 'secondary'
                              : 'default'
                          }
                          size="small"
                        />
                        <Typography variant="body2">
                          {tx.amount.toLocaleString()} {tx.token}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          by {tx.user}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {tx.timestamp}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {activeTab === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Advanced Analytics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Liquidity Over Time
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockUtilizationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="liquidity" fill="#36B04A" />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Risk Metrics
                  </Typography>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Health Factor: <strong>1.45</strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Liquidation Risk: <strong>Low</strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Collateral Ratio: <strong>150%</strong>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
