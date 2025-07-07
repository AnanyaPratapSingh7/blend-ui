import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  BookOpen,
  Bot,
  Copy,
  DollarSign,
  HelpCircle,
  MessageCircle,
  Minimize2,
  MoreVertical,
  RefreshCw,
  Send,
  Shield,
  Star,
  TrendingUp,
  User,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface AIAssistantProps {
  poolData?: any;
  onClose?: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

const SUGGESTED_QUESTIONS = [
  {
    icon: <HelpCircle size={16} />,
    text: 'What is a lending pool?',
    category: 'basics',
  },
  {
    icon: <TrendingUp size={16} />,
    text: 'How do I calculate my APY?',
    category: 'calculations',
  },
  {
    icon: <Shield size={16} />,
    text: 'What are the risks of lending?',
    category: 'risks',
  },
  {
    icon: <DollarSign size={16} />,
    text: 'How much can I borrow?',
    category: 'borrowing',
  },
  {
    icon: <BookOpen size={16} />,
    text: 'Explain collateral ratio',
    category: 'concepts',
  },
  {
    icon: <Zap size={16} />,
    text: 'What is liquidation?',
    category: 'liquidation',
  },
];

// Mock AI responses for demonstration
const mockAIResponses: Record<string, string> = {
  'what is a lending pool':
    'A lending pool is a smart contract that allows users to lend and borrow cryptocurrencies. When you supply assets to the pool, you earn interest from borrowers. The pool automatically manages interest rates based on supply and demand.',
  'how do i calculate my apy':
    'Your APY (Annual Percentage Yield) is calculated based on the current supply rate and compound interest. For example, if the current supply rate is 5% and interest compounds continuously, your effective APY would be approximately 5.13%. You can see your real-time APY in the dashboard.',
  'what are the risks of lending':
    'Main risks include: 1) Smart contract risk - bugs in the protocol, 2) Liquidation risk - if collateral value drops, 3) Interest rate risk - rates can fluctuate, 4) Platform risk - protocol governance changes. Always do your research and only invest what you can afford to lose.',
  'how much can i borrow':
    'Your borrowing capacity depends on: 1) Collateral value, 2) Collateral factor (typically 70-80%), 3) Health factor (must stay above 1.0). For example, with $1000 USDC collateral at 75% factor, you can borrow up to $750 worth of assets.',
  'explain collateral ratio':
    'Collateral ratio is the percentage of your loan value backed by collateral. A 150% ratio means you have $1.50 in collateral for every $1.00 borrowed. Higher ratios = lower liquidation risk. Most protocols require 100-150% minimum ratio.',
  'what is liquidation':
    'Liquidation occurs when your health factor drops below 1.0 (collateral value < loan value). The protocol automatically sells your collateral to repay the loan, often with a penalty. To avoid liquidation, maintain adequate collateral or repay loans when prices move against you.',
  default:
    "I'm here to help you understand DeFi lending! I can explain concepts like APY, collateral ratios, liquidation risks, and help you make informed decisions about your positions. What would you like to know?",
};

export const AIAssistant: React.FC<AIAssistantProps> = ({
  poolData,
  onClose,
  isMinimized,
  onMinimize,
}) => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content:
        "👋 Hi! I'm your DeFi lending assistant. I can help you understand how lending pools work, calculate your potential returns, and guide you through your first transaction. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    // Check for specific keywords
    for (const [key, response] of Object.entries(mockAIResponses)) {
      if (lowerQuestion.includes(key)) {
        return response;
      }
    }

    // Context-aware responses based on pool data
    if (poolData) {
      if (lowerQuestion.includes('pool') || lowerQuestion.includes('current')) {
        return `You're looking at the ${
          poolData.pool?.metadata?.name || 'Blend'
        } pool. It currently has $${
          poolData.poolEst?.totalSupply ? (poolData.poolEst.totalSupply / 1e6).toFixed(2) : 'N/A'
        }M in total supply and $${
          poolData.poolEst?.totalBorrowed
            ? (poolData.poolEst.totalBorrowed / 1e6).toFixed(2)
            : 'N/A'
        }M borrowed. The utilization rate is ${
          poolData.poolEst
            ? ((poolData.poolEst.totalBorrowed / poolData.poolEst.totalSupply) * 100).toFixed(1)
            : 'N/A'
        }%. Would you like to know more about any specific aspect?`;
      }
    }

    return mockAIResponses.default;
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (isMinimized) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Badge badgeContent={1} color="primary">
          <IconButton
            onClick={onMinimize}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: '#FFFFFF',
              width: 56,
              height: 56,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            <MessageCircle size={24} />
          </IconButton>
        </Badge>
      </Box>
    );
  }

  return (
    <Card
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 400,
        height: 600,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: theme.shadows[8],
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          bgcolor: theme.palette.primary.main,
          color: '#FFFFFF',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{ bgcolor: '#FFFFFF', color: theme.palette.primary.main, width: 32, height: 32 }}
          >
            <Bot size={20} />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              DeFi Assistant
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Online • Ready to help
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton size="small" onClick={onMinimize} sx={{ color: '#FFFFFF', mr: 1 }}>
            <Minimize2 size={18} />
          </IconButton>
          <IconButton size="small" onClick={handleMenuClick} sx={{ color: '#FFFFFF' }}>
            <MoreVertical size={18} />
          </IconButton>
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: theme.palette.background.default,
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                maxWidth: '80%',
                flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor:
                    message.type === 'user'
                      ? theme.palette.secondary.main
                      : theme.palette.primary.main,
                }}
              >
                {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
              </Avatar>
              <Box
                sx={{
                  bgcolor:
                    message.type === 'user'
                      ? theme.palette.secondary.main
                      : theme.palette.background.paper,
                  color: message.type === 'user' ? '#FFFFFF' : theme.palette.text.primary,
                  p: 1.5,
                  borderRadius: 2,
                  borderBottomLeftRadius: message.type === 'user' ? 2 : 0.5,
                  borderBottomRightRadius: message.type === 'user' ? 0.5 : 2,
                  position: 'relative',
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {message.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    opacity: 0.7,
                    fontSize: '0.7rem',
                  }}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                {message.type === 'bot' && (
                  <Box sx={{ position: 'absolute', top: -8, right: -8 }}>
                    <Tooltip title="Copy message">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyMessage(message.content)}
                        sx={{ bgcolor: theme.palette.background.default, width: 24, height: 24 }}
                      >
                        <Copy size={12} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ))}

        {isTyping && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
              <Bot size={16} />
            </Avatar>
            <Box
              sx={{
                bgcolor: theme.palette.background.paper,
                p: 1.5,
                borderRadius: 2,
                borderBottomLeftRadius: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                AI is typing...
              </Typography>
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Suggested Questions */}
      <Box sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Suggested questions:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {SUGGESTED_QUESTIONS.slice(0, 3).map((question, index) => (
            <Chip
              key={index}
              label={question.text}
              size="small"
              variant="outlined"
              onClick={() => handleSuggestedQuestion(question.text)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            ref={inputRef}
            fullWidth
            placeholder="Ask me anything about DeFi lending..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            variant="outlined"
            size="small"
            multiline
            maxRows={3}
            disabled={isTyping}
          />
          <Button
            variant="contained"
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            sx={{ minWidth: 48, height: 40 }}
          >
            <Send size={18} />
          </Button>
        </Box>
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 200 },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <RefreshCw size={16} />
          <Typography sx={{ ml: 1 }}>Clear Chat</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Star size={16} />
          <Typography sx={{ ml: 1 }}>Rate Assistant</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={onClose}>
          <X size={16} />
          <Typography sx={{ ml: 1 }}>Close</Typography>
        </MenuItem>
      </Menu>
    </Card>
  );
};
