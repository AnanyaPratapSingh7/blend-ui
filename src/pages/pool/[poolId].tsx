import { BackstopPoolEst, PoolEstimate } from '@blend-capital/blend-sdk';
import { Backdrop, Box, CircularProgress, Fab, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart3, HelpCircle, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AIAssistant } from '../../components/dashboard/AIAssistant';
import { PoolCompare } from '../../components/dashboard/PoolCompare';
import { PoolDashboard } from '../../components/dashboard/PoolDashboard';
import { TransactionModal } from '../../components/dashboard/TransactionModal';
import { WelcomeModal } from '../../components/dashboard/WelcomeModal';
import { useBackstop, useBackstopPool, usePool, usePoolMeta, usePoolOracle } from '../../hooks/api';

const PoolDetailPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { poolId } = router.query;

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMinimized, setAiMinimized] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<
    'supply' | 'withdraw' | 'borrow' | 'repay'
  >('supply');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showPoolCompare, setShowPoolCompare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: poolMeta } = usePoolMeta(poolId as string);
  const { data: pool } = usePool(poolMeta);
  const { data: oracle } = usePoolOracle(pool);
  const { data: backstop } = useBackstop(poolMeta?.version);
  const { data: backstopPool } = useBackstopPool(poolMeta);

  useEffect(() => {
    // Check if this is the user's first visit to a pool page
    const hasVisited = localStorage.getItem('blend-pool-visited');
    if (!hasVisited) {
      setShowWelcomeModal(true);
      localStorage.setItem('blend-pool-visited', 'true');
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

  if (!poolId) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={60} />
          <Box sx={{ fontSize: '1.1rem', fontWeight: 500 }}>Loading Pool Dashboard...</Box>
        </Box>
      </Backdrop>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {poolData && (
        <PoolDashboard
          poolData={poolData}
          onTransactionClick={handleTransactionClick}
          onCompareClick={() => setShowPoolCompare(true)}
        />
      )}

      {/* Fixed Action Buttons */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          zIndex: theme.zIndex.speedDial,
        }}
      >
        <Tooltip title="Pool Comparison" placement="left">
          <Fab
            size="medium"
            onClick={() => setShowPoolCompare(true)}
            sx={{
              bgcolor: 'accent.main',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'accent.main',
                opacity: 0.8,
              },
            }}
          >
            <BarChart3 size={20} />
          </Fab>
        </Tooltip>
        <Tooltip title="AI Assistant" placement="left">
          <Fab
            color="primary"
            onClick={handleAIToggle}
            sx={{
              bgcolor: showAIAssistant ? 'primary.main' : 'menu.main',
              color: 'text.primary',
              '&:hover': {
                bgcolor: showAIAssistant ? 'primary.main' : 'menu.main',
                opacity: 0.8,
              },
            }}
          >
            {showAIAssistant ? <MessageCircle size={20} /> : <HelpCircle size={20} />}
          </Fab>
        </Tooltip>
      </Box>

      {/* Modals */}
      <WelcomeModal
        open={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onComplete={handleWelcomeComplete}
      />

      <TransactionModal
        open={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        type={transactionType}
        poolData={poolData}
      />

      <PoolCompare
        open={showPoolCompare}
        onClose={() => setShowPoolCompare(false)}
        currentPool={poolData?.pool}
      />

      <AIAssistant
        poolData={poolData}
        onClose={() => setShowAIAssistant(false)}
        isMinimized={aiMinimized}
        onMinimize={handleAIMinimize}
      />
    </Box>
  );
};

export default PoolDetailPage;
