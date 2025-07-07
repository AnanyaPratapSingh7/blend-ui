import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart3, PieChart, Search, X } from 'lucide-react';
import { useState } from 'react';
import { toBalance, toPercentage } from '../../utils/formatter';

interface Pool {
  id: string;
  name: string;
  tvl: number;
  totalBorrowed: number;
  utilization: number;
  avgSupplyAPY: number;
  avgBorrowAPY: number;
  assets: number;
  backstopAPR: number;
  riskScore: number;
  isActive: boolean;
  volume24h: number;
  users: number;
}

interface PoolCompareProps {
  open: boolean;
  onClose: () => void;
  currentPool?: Pool;
  onSelectPool?: (pool: Pool) => void;
}

// Mock pool data
const MOCK_POOLS: Pool[] = [
  {
    id: 'CCLBPEYS3XFK65MYYXSBMOGKUI4ODN5S7SUZBGD7NALUQF64QILLX5B5',
    name: 'Stellar Core Pool',
    tvl: 12500000,
    totalBorrowed: 8750000,
    utilization: 70,
    avgSupplyAPY: 5.2,
    avgBorrowAPY: 8.5,
    assets: 8,
    backstopAPR: 12.3,
    riskScore: 85,
    isActive: true,
    volume24h: 2400000,
    users: 1250,
  },
  {
    id: 'CBLEND2STELLAR3MAINNET4POOL5EXAMPLE6ADDRESS7HERE8ABC',
    name: 'High Yield Pool',
    tvl: 8900000,
    totalBorrowed: 6200000,
    utilization: 69.7,
    avgSupplyAPY: 7.8,
    avgBorrowAPY: 11.2,
    assets: 6,
    backstopAPR: 15.6,
    riskScore: 78,
    isActive: true,
    volume24h: 1800000,
    users: 890,
  },
  {
    id: 'CSTABLE1POOL2USDC3CONSERVATIVE4LENDING5STELLAR6NETWORK',
    name: 'Stable Pool',
    tvl: 25600000,
    totalBorrowed: 18400000,
    utilization: 71.9,
    avgSupplyAPY: 3.4,
    avgBorrowAPY: 5.8,
    assets: 4,
    backstopAPR: 8.7,
    riskScore: 92,
    isActive: true,
    volume24h: 3200000,
    users: 2100,
  },
  {
    id: 'CEXPERIMENTAL1POOL2BETA3TESTING4HIGHER5RISK6REWARDS',
    name: 'Beta Pool',
    tvl: 3200000,
    totalBorrowed: 1800000,
    utilization: 56.3,
    avgSupplyAPY: 12.5,
    avgBorrowAPY: 18.7,
    assets: 12,
    backstopAPR: 22.1,
    riskScore: 65,
    isActive: true,
    volume24h: 850000,
    users: 320,
  },
];

export const PoolCompare: React.FC<PoolCompareProps> = ({
  open,
  onClose,
  currentPool,
  onSelectPool,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredPools = MOCK_POOLS.filter((pool) => {
    const matchesSearch = pool.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showInactive || pool.isActive;
    return matchesSearch && matchesStatus;
  });

  const handlePoolSelect = (poolId: string) => {
    if (selectedPools.includes(poolId)) {
      setSelectedPools(selectedPools.filter((id) => id !== poolId));
    } else if (selectedPools.length < 3) {
      setSelectedPools([...selectedPools, poolId]);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 85) return theme.palette.success.main;
    if (score >= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getRiskLabel = (score: number) => {
    if (score >= 85) return 'Low Risk';
    if (score >= 70) return 'Medium Risk';
    return 'High Risk';
  };

  const renderPoolCard = (pool: Pool) => (
    <Card
      key={pool.id}
      sx={{
        mb: 2,
        border: selectedPools.includes(pool.id)
          ? `2px solid ${theme.palette.primary.main}`
          : '1px solid transparent',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      }}
      onClick={() => handlePoolSelect(pool.id)}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {pool.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pool.assets} assets • {pool.users} users
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={getRiskLabel(pool.riskScore)}
              size="small"
              sx={{
                bgcolor: getRiskColor(pool.riskScore) + '20',
                color: getRiskColor(pool.riskScore),
              }}
            />
            {pool.isActive && (
              <Chip label="Active" color="success" size="small" variant="outlined" />
            )}
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              TVL
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${toBalance(pool.tvl)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Supply APY
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {toPercentage(pool.avgSupplyAPY / 100)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Utilization
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {pool.utilization}%
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              24h Volume
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${toBalance(pool.volume24h)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderComparisonTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pool</TableCell>
            <TableCell align="right">TVL</TableCell>
            <TableCell align="right">Supply APY</TableCell>
            <TableCell align="right">Borrow APY</TableCell>
            <TableCell align="right">Utilization</TableCell>
            <TableCell align="right">Risk Score</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPools.map((pool) => (
            <TableRow
              key={pool.id}
              selected={selectedPools.includes(pool.id)}
              onClick={() => handlePoolSelect(pool.id)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                    {pool.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {pool.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {pool.assets} assets
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="bold">
                  ${toBalance(pool.tvl)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {toPercentage(pool.avgSupplyAPY / 100)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="bold" color="secondary">
                  {toPercentage(pool.avgBorrowAPY / 100)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">{pool.utilization}%</Typography>
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={pool.riskScore}
                  size="small"
                  sx={{
                    bgcolor: getRiskColor(pool.riskScore) + '20',
                    color: getRiskColor(pool.riskScore),
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectPool) {
                      onSelectPool(pool);
                    }
                  }}
                >
                  Select
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 700,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight="bold">
          Compare Pools
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Filters */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search pools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showInactive}
                      onChange={(e) => setShowInactive(e.target.checked)}
                    />
                  }
                  label="Show Inactive"
                />
                <Tooltip title="Switch View">
                  <IconButton onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}>
                    {viewMode === 'table' ? <BarChart3 size={20} /> : <PieChart size={20} />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Current Pool Highlight */}
        {currentPool && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current Pool
            </Typography>
            <Card
              sx={{
                bgcolor: theme.palette.primary.main + '10',
                border: `1px solid ${theme.palette.primary.main}`,
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {currentPool.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your active pool
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        TVL
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        ${toBalance(currentPool.tvl)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        APY
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {toPercentage(currentPool.avgSupplyAPY / 100)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Selected Pools for Comparison */}
        {selectedPools.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Selected for Comparison ({selectedPools.length}/3)
            </Typography>
            <Grid container spacing={2}>
              {selectedPools.map((poolId) => {
                const pool = MOCK_POOLS.find((p) => p.id === poolId);
                if (!pool) return null;
                return (
                  <Grid item xs={12} md={4} key={poolId}>
                    <Card sx={{ bgcolor: theme.palette.background.default }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {pool.name}
                          </Typography>
                          <IconButton size="small" onClick={() => handlePoolSelect(poolId)}>
                            <X size={16} />
                          </IconButton>
                        </Box>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              TVL
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              ${toBalance(pool.tvl)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              APY
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {toPercentage(pool.avgSupplyAPY / 100)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Pool List */}
        <Typography variant="h6" gutterBottom>
          Available Pools
        </Typography>
        {viewMode === 'cards' ? (
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>{filteredPools.map(renderPoolCard)}</Box>
        ) : (
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>{renderComparisonTable()}</Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={selectedPools.length === 0}
          onClick={() => {
            // Handle comparison logic
            console.log('Compare pools:', selectedPools);
          }}
        >
          Compare Selected ({selectedPools.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};
