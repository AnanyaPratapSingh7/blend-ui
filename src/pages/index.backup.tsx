import { BackstopPoolEst, PoolEstimate } from '@blend-capital/blend-sdk';
import { Backdrop, Box, CircularProgress, Fab, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart3, HelpCircle, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AIAssistant } from '../components/dashboard/AIAssistant';
import { PoolCompare } from '../components/dashboard/PoolCompare';
import { PoolDashboard } from '../components/dashboard/PoolDashboard';
import { TransactionModal } from '../components/dashboard/TransactionModal';
import { WelcomeModal } from '../components/dashboard/WelcomeModal';
import { useBackstop, useBackstopPool, usePool, usePoolMeta, usePoolOracle } from '../hooks/api';

const BlendPoolDashboard = () => {
  const theme = useTheme();
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMinimized, setAiMinimized] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<
    'supply' | 'withdraw' | 'borrow' | 'repay'
  >('supply');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showPoolCompare, setShowPoolCompare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use the most active pool by default
  const poolId = 'CCLBPEYS3XFK65MYYXSBMOGKUI4ODN5S7SUZBGD7NALUQF64QILLX5B5';

  const { data: poolMeta } = usePoolMeta(poolId);
  const { data: pool } = usePool(poolMeta);
  const { data: oracle } = usePoolOracle(pool);
  const { data: backstop } = useBackstop(poolMeta?.version);
  const { data: backstopPool } = useBackstopPool(poolMeta);

  useEffect(() => {
    // Check if this is the user's first visit
    const hasVisited = localStorage.getItem('blend-dashboard-visited');
    if (!hasVisited) {
      setShowWelcomeModal(true);
      localStorage.setItem('blend-dashboard-visited', 'true');
    }
  }, []);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const poolData = (() => {
    if (!poolMeta || !pool || !oracle || !backstop || !backstopPool) {
      return null;
    }

    const poolEst = PoolEstimate.build(pool.reserves, oracle);
    const backstopPoolEst = BackstopPoolEst.build(backstop.backstopToken, backstopPool.poolBalance);

    const estBackstopApr =
      poolEst && backstopPoolEst.totalSpotValue > 0
        ? ((pool.metadata.backstopRate / 1e7) * poolEst.avgBorrowApy * poolEst.totalBorrowed) /
          backstopPoolEst.totalSpotValue
        : 0;

    return {
      pool,
      poolEst,
      backstopPoolEst,
      estBackstopApr,
    };
  })();

  const handleTransactionClick = (type: 'supply' | 'withdraw' | 'borrow' | 'repay') => {
    setTransactionType(type);
    setShowTransactionModal(true);
  };

  const handleWelcomeComplete = () => {
    setShowWelcomeModal(false);
    setShowAIAssistant(true);
  };

  const handleAIToggle = () => {
    if (aiMinimized) {
      setAiMinimized(false);
    } else {
      setShowAIAssistant(!showAIAssistant);
    }
  };

  const handleAIMinimize = () => {
    setAiMinimized(!aiMinimized);
  };

  if (isLoading) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={60} />
          <Box sx={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              Loading Blend Pool Dashboard
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Fetching real-time data...</div>
          </Box>
        </Box>
      </Backdrop>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Main Dashboard */}
      <PoolDashboard
        poolData={poolData}
        onSupply={() => handleTransactionClick('supply')}
        onWithdraw={() => handleTransactionClick('withdraw')}
        onBorrow={() => handleTransactionClick('borrow')}
        onRepay={() => handleTransactionClick('repay')}
      />

      {/* Floating Action Buttons */}
      <Box
        sx={{
          position: 'fixed',
          bottom: showAIAssistant && !aiMinimized ? 640 : 20,
          right: 20,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Tooltip title="Compare Pools" placement="left">
          <Fab
            color="secondary"
            onClick={() => setShowPoolCompare(true)}
            sx={{ width: 48, height: 48 }}
          >
            <BarChart3 size={24} />
          </Fab>
        </Tooltip>

        <Tooltip title="Help & FAQ" placement="left">
          <Fab
            color="default"
            onClick={() => setShowWelcomeModal(true)}
            sx={{ width: 48, height: 48 }}
          >
            <HelpCircle size={24} />
          </Fab>
        </Tooltip>

        {!showAIAssistant && !aiMinimized && (
          <Tooltip title="AI Assistant" placement="left">
            <Fab color="primary" onClick={handleAIToggle} sx={{ width: 56, height: 56 }}>
              <MessageCircle size={28} />
            </Fab>
          </Tooltip>
        )}
      </Box>

      {/* AI Assistant */}
      {(showAIAssistant || aiMinimized) && (
        <AIAssistant
          poolData={poolData}
          onClose={() => setShowAIAssistant(false)}
          isMinimized={aiMinimized}
          onMinimize={handleAIMinimize}
        />
      )}

      {/* Transaction Modal */}
      <TransactionModal
        open={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        type={transactionType}
        poolData={poolData}
        onConfirm={(amount) => {
          console.log(`${transactionType} ${amount}`);
          setShowTransactionModal(false);
        }}
      />

      {/* Welcome Modal */}
      <WelcomeModal
        open={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onComplete={handleWelcomeComplete}
      />

      {/* Pool Compare Modal */}
      <PoolCompare
        open={showPoolCompare}
        onClose={() => setShowPoolCompare(false)}
        currentPool={
          poolData
            ? {
                id: poolData.pool.id,
                name: poolData.pool.metadata.name,
                tvl: poolData.poolEst?.totalSupply || 0,
                totalBorrowed: poolData.poolEst?.totalBorrowed || 0,
                utilization:
                  poolData.poolEst?.totalSupply > 0
                    ? (poolData.poolEst.totalBorrowed / poolData.poolEst.totalSupply) * 100
                    : 0,
                avgSupplyAPY: poolData.poolEst?.avgBorrowApy
                  ? poolData.poolEst.avgBorrowApy * 100
                  : 5.2,
                avgBorrowAPY: poolData.poolEst?.avgBorrowApy
                  ? poolData.poolEst.avgBorrowApy * 100
                  : 8.5,
                assets: poolData.pool.reserves.size,
                backstopAPR: poolData.estBackstopApr * 100,
                riskScore: 85,
                isActive: true,
                volume24h: 2400000,
                users: 1250,
              }
            : undefined
        }
        onSelectPool={(pool) => {
          console.log('Selected pool:', pool);
          setShowPoolCompare(false);
        }}
      />
    </Box>
  );
};

export default BlendPoolDashboard;
