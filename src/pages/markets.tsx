import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Activity, ArrowUpRight, BarChart3, Shield, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toBalance } from '../utils/formatter';

// Mock data for multiple pools - replace with actual API calls
const mockPools = [
  {
    id: 'CCLBPEYS3XFK65MYYXSBMOGKUI4ODN5S7SUZBGD7NALUQF64QILLX5B5',
    name: 'Main Pool',
    description: 'Primary lending pool for major assets',
    tvl: 1250000,
    totalBorrowed: 850000,
    utilization: 68,
    avgSupplyApy: 5.2,
    avgBorrowApy: 8.7,
    assets: ['USDC', 'XLM', 'BLND'],
    backstopApr: 12.5,
    isActive: true,
    risk: 'Low',
    volume24h: 125000,
  },
  {
    id: 'POOL2_EXAMPLE_ID',
    name: 'High Yield Pool',
    description: 'Higher risk, higher reward lending pool',
    tvl: 750000,
    totalBorrowed: 450000,
    utilization: 60,
    avgSupplyApy: 8.9,
    avgBorrowApy: 12.3,
    assets: ['USDC', 'XLM', 'BTC'],
    backstopApr: 18.2,
    isActive: true,
    risk: 'Medium',
    volume24h: 89000,
  },
  {
    id: 'POOL3_EXAMPLE_ID',
    name: 'Stablecoin Pool',
    description: 'Conservative pool focused on stablecoins',
    tvl: 2100000,
    totalBorrowed: 1200000,
    utilization: 57,
    avgSupplyApy: 3.8,
    avgBorrowApy: 6.1,
    assets: ['USDC', 'USDT', 'DAI'],
    backstopApr: 7.5,
    isActive: true,
    risk: 'Low',
    volume24h: 180000,
  },
];

const MarketsPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'tvl' | 'apy' | 'utilization'>('tvl');

  const handlePoolClick = (poolId: string) => {
    router.push(`/pool/${poolId}`);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      default:
        return 'default';
    }
  };

  const sortedPools = [...mockPools].sort((a, b) => {
    switch (sortBy) {
      case 'tvl':
        return b.tvl - a.tvl;
      case 'apy':
        return b.avgSupplyApy - a.avgSupplyApy;
      case 'utilization':
        return b.utilization - a.utilization;
      default:
        return 0;
    }
  });

  // Calculate total metrics
  const totalTVL = mockPools.reduce((sum, pool) => sum + pool.tvl, 0);
  const totalBorrowed = mockPools.reduce((sum, pool) => sum + pool.totalBorrowed, 0);
  const avgUtilization =
    mockPools.reduce((sum, pool) => sum + pool.utilization, 0) / mockPools.length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h1" sx={{ mb: 1, color: 'text.primary' }}>
            Lending Markets
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Explore and participate in decentralized lending pools on Stellar
          </Typography>
        </Box>

        {/* Market Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <BarChart3 size={24} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Value Locked
                    </Typography>
                    <Typography variant="h2" color="text.primary">
                      ${toBalance(totalTVL)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'borrow.main' }}>
                    <TrendingUp size={24} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Borrowed
                    </Typography>
                    <Typography variant="h2" color="text.primary">
                      ${toBalance(totalBorrowed)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'positive.main' }}>
                    <Activity size={24} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Avg Utilization
                    </Typography>
                    <Typography variant="h2" color="text.primary">
                      {avgUtilization.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sort Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', alignSelf: 'center' }}>
            Sort by:
          </Typography>
          <Button
            variant={sortBy === 'tvl' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('tvl')}
            size="small"
          >
            TVL
          </Button>
          <Button
            variant={sortBy === 'apy' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('apy')}
            size="small"
          >
            APY
          </Button>
          <Button
            variant={sortBy === 'utilization' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('utilization')}
            size="small"
          >
            Utilization
          </Button>
        </Box>

        {/* Pool Cards */}
        <Grid container spacing={3}>
          {sortedPools.map((pool) => (
            <Grid item xs={12} md={6} lg={4} key={pool.id}>
              <Card
                sx={{
                  bgcolor: 'background.paper',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => handlePoolClick(pool.id)}
              >
                <CardContent>
                  {/* Pool Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h3" sx={{ color: 'text.primary', mb: 0.5 }}>
                        {pool.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {pool.description}
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      <ArrowUpRight size={16} />
                    </IconButton>
                  </Box>

                  {/* Assets */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {pool.assets.map((asset) => (
                      <Chip
                        key={asset}
                        label={asset}
                        size="small"
                        sx={{
                          bgcolor: 'menu.main',
                          color: 'text.primary',
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                  </Box>

                  {/* Key Metrics */}
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Value Locked
                      </Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        ${toBalance(pool.tvl)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Supply APY
                      </Typography>
                      <Typography variant="body2" color="lend.main" fontWeight={500}>
                        {pool.avgSupplyApy.toFixed(2)}%
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Borrow APY
                      </Typography>
                      <Typography variant="body2" color="borrow.main" fontWeight={500}>
                        {pool.avgBorrowApy.toFixed(2)}%
                      </Typography>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Utilization
                        </Typography>
                        <Typography variant="body2" color="text.primary" fontWeight={500}>
                          {pool.utilization}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pool.utilization}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'menu.main',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor:
                              pool.utilization > 80
                                ? 'error.main'
                                : pool.utilization > 60
                                ? 'warning.main'
                                : 'success.main',
                          },
                        }}
                      />
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Footer */}
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Shield size={16} />
                      <Chip
                        label={pool.risk}
                        size="small"
                        color={getRiskColor(pool.risk) as any}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      24h Volume: ${toBalance(pool.volume24h)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MarketsPage;
