import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  DollarSign,
  Info,
  Rocket,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ONBOARDING_STEPS = [
  {
    title: 'Welcome to Blend',
    icon: <Rocket size={24} />,
    content: 'Start your DeFi lending journey with the most trusted protocol on Stellar',
  },
  {
    title: 'How It Works',
    icon: <BookOpen size={24} />,
    content: 'Learn the basics of lending and borrowing in decentralized finance',
  },
  {
    title: 'Safety First',
    icon: <Shield size={24} />,
    content: 'Understand risks and security measures to protect your assets',
  },
  {
    title: 'Get Started',
    icon: <Star size={24} />,
    content: 'Connect your wallet and make your first transaction',
  },
];

const FEATURES = [
  {
    icon: <TrendingUp size={20} />,
    title: 'Earn Interest',
    description: 'Supply assets and earn competitive yields on your deposits',
    color: '#00C4EF',
  },
  {
    icon: <DollarSign size={20} />,
    title: 'Borrow Assets',
    description: 'Access liquidity by borrowing against your collateral',
    color: '#FF8A00',
  },
  {
    icon: <Shield size={20} />,
    title: 'Secure Protocol',
    description: 'Audited smart contracts and robust security measures',
    color: '#E16BFF',
  },
  {
    icon: <Users size={20} />,
    title: 'Community Driven',
    description: 'Decentralized governance and transparent operations',
    color: '#36B04A',
  },
];

const SAFETY_TIPS = [
  {
    icon: <CheckCircle size={16} />,
    text: 'Always verify contract addresses before transactions',
  },
  {
    icon: <CheckCircle size={16} />,
    text: 'Start with small amounts to test the protocol',
  },
  {
    icon: <CheckCircle size={16} />,
    text: 'Monitor your health factor to avoid liquidation',
  },
  {
    icon: <CheckCircle size={16} />,
    text: 'Keep some assets as buffer for market volatility',
  },
];

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onClose, onComplete }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleNext = () => {
    if (activeStep < ONBOARDING_STEPS.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSkip = () => {
    onComplete();
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: theme.palette.primary.main,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Rocket size={40} />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome to Blend!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                The premier lending protocol on Stellar. Start earning yield on your crypto assets
                or borrow against your holdings with institutional-grade security.
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mt: 3 }}>
              {FEATURES.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card sx={{ height: '100%', border: `1px solid ${feature.color}20` }}>
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: feature.color,
                          width: 40,
                          height: 40,
                          mx: 'auto',
                          mb: 1,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.primary.main + '10', borderRadius: 2 }}>
              <Typography variant="body2" color="primary" fontWeight="bold">
                💡 Pro Tip: Start with supplying stable assets like USDC for steady, predictable
                returns!
              </Typography>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: theme.palette.secondary.main,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <BookOpen size={30} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                How Blend Works
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Understanding the basics of decentralized lending
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', bgcolor: theme.palette.background.default }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                        <TrendingUp size={20} />
                      </Avatar>
                      <Typography variant="h6">Supply & Earn</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      1. Supply your crypto assets to the pool
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      2. Earn interest paid by borrowers
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      3. Withdraw anytime with accumulated interest
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip label="Low Risk" color="success" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', bgcolor: theme.palette.background.default }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.warning.main, mr: 2 }}>
                        <DollarSign size={20} />
                      </Avatar>
                      <Typography variant="h6">Borrow & Leverage</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      1. Deposit collateral (150% of loan value)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      2. Borrow up to your credit limit
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      3. Repay anytime to unlock collateral
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip label="Higher Risk" color="warning" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 3, bgcolor: theme.palette.info.main + '10', borderRadius: 2 }}>
              <Typography variant="body2" color="info.main" fontWeight="bold" gutterBottom>
                📈 Interest Rates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rates are dynamic and adjust based on supply and demand. When more people want to
                borrow, rates increase, benefiting suppliers. When there's excess liquidity, rates
                decrease.
              </Typography>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: theme.palette.error.main,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Shield size={30} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Safety & Security
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Understanding risks and how to stay safe
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', bgcolor: theme.palette.background.default }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="error">
                      Key Risks
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold" gutterBottom>
                        Smart Contract Risk
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bugs in code could lead to loss of funds
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold" gutterBottom>
                        Liquidation Risk
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Collateral can be sold if health factor drops below 1.0
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold" gutterBottom>
                        Interest Rate Risk
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rates can fluctuate based on market conditions
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', bgcolor: theme.palette.background.default }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="success.main">
                      Safety Tips
                    </Typography>
                    {SAFETY_TIPS.map((tip, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box sx={{ color: theme.palette.success.main, mr: 1, mt: 0.5 }}>
                          {tip.icon}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {tip.text}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 3, bgcolor: theme.palette.warning.main + '10', borderRadius: 2 }}>
              <Typography variant="body2" color="warning.main" fontWeight="bold" gutterBottom>
                ⚠️ Important Reminder
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Only invest what you can afford to lose. DeFi protocols carry inherent risks, and
                past performance doesn't guarantee future results.
              </Typography>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.success.main,
                mx: 'auto',
                mb: 3,
              }}
            >
              <Star size={40} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              You're Ready to Start!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Connect your Stellar wallet and make your first transaction
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  width: 200,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: theme.palette.success.main + '20',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: theme.palette.success.main,
                  },
                }}
              />
            </Box>

            <Grid container spacing={2} sx={{ maxWidth: 400, mx: 'auto' }}>
              <Grid item xs={6}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Zap size={24} color={theme.palette.primary.main} />
                  <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                    Quick Start
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supply USDC
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Target size={24} color={theme.palette.secondary.main} />
                  <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                    Explore
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Browse Assets
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, p: 2, bgcolor: theme.palette.background.default, borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                💬 Need help? Our AI assistant is here to guide you through every step!
              </Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 600,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative' }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {ONBOARDING_STEPS[activeStep].title}
              </Typography>
              <Chip
                label={`${activeStep + 1} of ${ONBOARDING_STEPS.length}`}
                size="small"
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Need help?">
                <IconButton size="small" onClick={() => setShowTooltip(!showTooltip)}>
                  <Info size={20} />
                </IconButton>
              </Tooltip>
              <IconButton size="small" onClick={onClose}>
                <X size={20} />
              </IconButton>
            </Box>
          </Box>

          {/* Progress */}
          <Box sx={{ p: 3, pb: 0 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {ONBOARDING_STEPS.map((step, index) => (
                <Step key={index}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor:
                            index <= activeStep
                              ? theme.palette.primary.main
                              : theme.palette.grey[300],
                        }}
                      >
                        {index < activeStep ? <CheckCircle size={16} /> : step.icon}
                      </Avatar>
                    )}
                  />
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Content */}
          <Box sx={{ px: 3 }}>{renderStepContent()}</Box>

          {/* Footer */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleSkip}
              disabled={activeStep === ONBOARDING_STEPS.length - 1}
            >
              Skip Tutorial
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={
                  activeStep === ONBOARDING_STEPS.length - 1 ? (
                    <CheckCircle size={18} />
                  ) : (
                    <ArrowRight size={18} />
                  )
                }
                sx={{ minWidth: 120 }}
              >
                {activeStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
