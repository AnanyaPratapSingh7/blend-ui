import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CheckCircle, Info, X } from 'lucide-react';
import { useState } from 'react';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  type: 'supply' | 'withdraw' | 'borrow' | 'repay';
  asset?: any;
  poolData?: any;
  onConfirm?: (amount: string) => void;
}

const TRANSACTION_STEPS = ['Review', 'Confirm', 'Processing', 'Complete'];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  onClose,
  type,
  asset,
  poolData,
  onConfirm,
}) => {
  const theme = useTheme();
  const [amount, setAmount] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getTransactionTitle = () => {
    switch (type) {
      case 'supply':
        return 'Supply Assets';
      case 'withdraw':
        return 'Withdraw Assets';
      case 'borrow':
        return 'Borrow Assets';
      case 'repay':
        return 'Repay Loan';
      default:
        return 'Transaction';
    }
  };

  const getTransactionColor = () => {
    switch (type) {
      case 'supply':
        return theme.palette.primary.main;
      case 'withdraw':
        return theme.palette.secondary.main;
      case 'borrow':
        return theme.palette.warning.main;
      case 'repay':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError('');
  };

  const handleMaxClick = () => {
    // Mock max amount calculation
    const maxAmount = type === 'supply' ? '10000' : type === 'borrow' ? '5000' : '7500';
    setAmount(maxAmount);
  };

  const handleNextStep = () => {
    if (activeStep === 0 && !amount) {
      setError('Please enter an amount');
      return;
    }

    if (activeStep === 1) {
      setIsProcessing(true);
      // Simulate transaction processing
      setTimeout(() => {
        setIsProcessing(false);
        setActiveStep(activeStep + 1);
        if (onConfirm) {
          onConfirm(amount);
        }
      }, 3000);
    }

    setActiveStep(activeStep + 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    setAmount('');
    setError('');
    setIsProcessing(false);
    onClose();
  };

  const calculateInterest = (amount: string) => {
    const numAmount = parseFloat(amount || '0');
    const rate = type === 'supply' ? 0.05 : 0.08; // 5% supply, 8% borrow
    return (numAmount * rate).toFixed(2);
  };

  const calculateHealthFactor = (amount: string) => {
    // Mock health factor calculation
    const baseHealth = 1.45;
    const numAmount = parseFloat(amount || '0');
    const impact = type === 'borrow' ? -0.1 : 0.1;
    return Math.max(0.1, baseHealth + (numAmount / 10000) * impact).toFixed(2);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Enter Amount
            </Typography>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label={`Amount to ${type}`}
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                type="number"
                InputProps={{
                  endAdornment: (
                    <Button size="small" onClick={handleMaxClick} sx={{ ml: 1 }}>
                      MAX
                    </Button>
                  ),
                }}
                error={!!error}
                helperText={error}
              />
            </Box>

            {amount && (
              <Card sx={{ mb: 2, bgcolor: theme.palette.background.default }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Transaction Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Amount
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {amount} USDC
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        {type === 'supply' ? 'Expected APY' : 'Interest Rate'}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color={getTransactionColor()}>
                        {type === 'supply' ? '5.2%' : '8.5%'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Annual Interest
                      </Typography>
                      <Typography variant="body1">${calculateInterest(amount)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Health Factor
                      </Typography>
                      <Typography variant="body1">{calculateHealthFactor(amount)}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {type === 'supply' && 'Your supplied assets will earn interest immediately.'}
                {type === 'borrow' &&
                  'Make sure to maintain adequate collateral to avoid liquidation.'}
                {type === 'withdraw' && 'You can withdraw your supplied assets anytime.'}
                {type === 'repay' && 'Repaying reduces your loan balance and interest payments.'}
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                Advanced Options
              </Button>
              <Tooltip title="Show advanced transaction options">
                <IconButton size="small">
                  <Info size={16} />
                </IconButton>
              </Tooltip>
            </Box>

            {showAdvanced && (
              <Card sx={{ mb: 2, bgcolor: theme.palette.background.paper }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Advanced Settings
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Gas Price (Stroops)"
                        defaultValue="100"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Slippage Tolerance (%)"
                        defaultValue="1.0"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Transaction
            </Typography>
            <Card sx={{ mb: 2, bgcolor: theme.palette.background.default }}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    {getTransactionTitle()}
                  </Typography>
                  <Chip label={type.toUpperCase()} color="primary" variant="outlined" />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Amount
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {amount} USDC
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {type === 'supply' ? 'APY' : 'Interest Rate'}
                      </Typography>
                      <Typography variant="body1">{type === 'supply' ? '5.2%' : '8.5%'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Health Factor (After)
                      </Typography>
                      <Typography variant="body1">{calculateHealthFactor(amount)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Estimated Gas Fee
                      </Typography>
                      <Typography variant="body1">~0.00012 XLM</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Please review all details carefully. This transaction cannot be reversed.
              </Typography>
            </Alert>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Processing Transaction
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while your transaction is being processed...
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2">Status: Waiting for confirmation</Typography>
              <Typography variant="body2" color="text.secondary">
                This may take a few moments
              </Typography>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle
              size={60}
              color={theme.palette.success.main}
              style={{ marginBottom: 16 }}
            />
            <Typography variant="h6" gutterBottom>
              Transaction Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Your {type} transaction has been completed successfully.
            </Typography>
            <Card sx={{ mb: 2, bgcolor: theme.palette.background.default }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Transaction Hash
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  0x1234...5678
                </Typography>
              </CardContent>
            </Card>
            <Button
              variant="outlined"
              onClick={() => window.open('https://stellar.expert', '_blank')}
              sx={{ mr: 1 }}
            >
              View on Stellar Expert
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 600,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight="bold">
          {getTransactionTitle()}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {TRANSACTION_STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {renderStepContent()}
      </DialogContent>

      {activeStep < 3 && (
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleNextStep}
            disabled={isProcessing || (activeStep === 0 && !amount)}
            sx={{ minWidth: 120 }}
          >
            {isProcessing ? (
              <CircularProgress size={20} />
            ) : activeStep === 0 ? (
              'Review'
            ) : activeStep === 1 ? (
              'Confirm'
            ) : (
              'Next'
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
