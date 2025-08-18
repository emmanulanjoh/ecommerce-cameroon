import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  IconButton, 
  Typography, 
  Avatar,
  Fab,
  Collapse,
  Chip
} from '@mui/material';
import { 
  Send, 
  SmartToy, 
  Close, 

  ShoppingCart,
  Help,
  Phone
} from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI shopping assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: 'Find Products', icon: <ShoppingCart />, action: 'search' },
    { label: 'Order Status', icon: <Help />, action: 'status' },
    { label: 'Contact Support', icon: <Phone />, action: 'contact' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: 'e-commerce assistant for FindAll Sourcing in Cameroon'
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.reply;
      }
    } catch (error) {
      console.error('AI API error:', error);
    }
    
    // Enhanced fallback responses
    const message = userMessage.toLowerCase();
    
    if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
      return 'I can help you find products in your budget! What\'s your price range? We have items from 5,000 XAF to 2,000,000 XAF.';
    }
    
    if (message.includes('phone') || message.includes('smartphone') || message.includes('mobile')) {
      return 'We have great smartphones available! Popular brands include Samsung, iPhone, Tecno, and Infinix. What\'s your budget?';
    }
    
    if (message.includes('laptop') || message.includes('computer')) {
      return 'We offer various laptops and computers! From budget-friendly options to high-performance machines. What will you use it for?';
    }
    
    if (message.includes('delivery') || message.includes('shipping') || message.includes('transport')) {
      return 'We deliver across Cameroon! 🚚 Yaoundé & Douala: 1-2 days, Other cities: 2-3 days. FREE delivery on orders above 50,000 XAF!';
    }
    
    if (message.includes('payment') || message.includes('pay') || message.includes('money')) {
      return 'Payment options: 📱 MTN/Orange Mobile Money, 🏦 Bank transfer, 💵 Cash on delivery. All secure and convenient!';
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! 👋 Welcome to FindAll Sourcing! I\'m here to help you find the perfect products. What are you looking for today?';
    }
    
    if (message.includes('help') || message.includes('support') || message.includes('assist')) {
      return 'I\'m here to help! 😊 Ask me about products, prices, delivery, or payments. For complex issues, contact us on WhatsApp: +237 678 830 036';
    }
    
    if (message.includes('category') || message.includes('type')) {
      return 'We have many categories: 📱 Electronics, 👕 Fashion, 🏠 Home & Kitchen, 💄 Beauty, ⚽ Sports, and more! What interests you?';
    }
    
    // Dynamic response based on message content
    const responses = [
      `I understand you\'re asking about "${userMessage}". Let me help you with that! What specific information do you need?`,
      `Great question about "${userMessage}"! I\'d be happy to assist. Can you provide more details?`,
      `Thanks for asking about "${userMessage}". For detailed information, I can connect you with our team via WhatsApp: +237 678 830 036`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Get AI response
    setTimeout(async () => {
      const responseText = await generateBotResponse(inputText);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'search':
        message = 'I want to find products';
        break;
      case 'status':
        message = 'Check my order status';
        break;
      case 'contact':
        message = 'I need to contact support';
        break;
    }
    setInputText(message);
  };

  return (
    <>
      {/* Chat Fab Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <Close /> : <SmartToy />}
      </Fab>

      {/* Chat Window */}
      <Collapse in={isOpen}>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: 350,
            height: 500,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              <SmartToy />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="600">
                AI Assistant
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Online • Ready to help
              </Typography>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              bgcolor: '#f5f5f5',
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Actions */}
          <Box sx={{ p: 1, bgcolor: 'white', borderTop: '1px solid #eee' }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {quickActions.map((action) => (
                <Chip
                  key={action.action}
                  icon={action.icon}
                  label={action.label}
                  size="small"
                  onClick={() => handleQuickAction(action.action)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #eee' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                sx={{ borderRadius: 2 }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default ChatBot;