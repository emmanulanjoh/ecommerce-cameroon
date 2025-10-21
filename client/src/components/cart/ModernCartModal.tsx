import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  Chip,
  Badge,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  Avatar,
  Slide,
  Zoom,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  Delete,
  WhatsApp,
  ShoppingCart,
  CheckCircle,
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ModernCartModalProps {
  open: boolean;
  onClose: () => void;
}

const ModernCartModal: React.FC<ModernCartModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  
  const [activeStep, setActiveStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    generateWhatsAppMessage,
  } = useCart();

  const steps = ['Cart Review', 'Shipping Info', 'Confirm Order'];

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
    }).format(price);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleWhatsAppOrder = async () => {
    try {
      // Create order in database first
      const token = localStorage.getItem('token');
      if (token) {
        const orderData = {
          items: cartItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
          })),
          shippingAddress: {
            name: shippingInfo.name,
            street: shippingInfo.address,
            city: shippingInfo.city,
            region: 'Cameroon',
            country: 'Cameroon',
            phone: shippingInfo.phone
          },
          notes: 'Order placed via WhatsApp'
        };

        await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });
        
        console.log('✅ Order saved to database');
      }
    } catch (error) {
      console.error('❌ Failed to save order:', error);
    }
    
    // Send WhatsApp message
    const message = generateWhatsAppMessage();
    const customerInfo = `%0A%0ACustomer: ${shippingInfo.name}%0APhone: ${shippingInfo.phone}%0AAddress: ${shippingInfo.address}, ${shippingInfo.city}`;
    const fullMessage = message + customerInfo;
    const whatsappUrl = `https://wa.me/237678830036?text=${fullMessage}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    onClose();
  };

  const renderCartItems = () => (
    <Box>
      <AnimatePresence>
        {cartItems.map((item) => (
          <motion.div
            key={item.product._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ 
              mb: 2, 
              pb: 2,
              borderBottom: '1px solid #eee',
              '&:last-child': { borderBottom: 'none' }
            }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 1, md: 2 },
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Avatar
                    src={item.product.images?.[0] || '/images/placeholder.jpg'}
                    alt={item.product.nameEn}
                    sx={{ width: 60, height: 60, borderRadius: 2 }}
                    variant="rounded"
                  />
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      {item.product.nameEn}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatPrice(item.product.price)} each
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Remove />
                    </IconButton>
                    
                    <Chip
                      label={item.quantity}
                      size="small"
                      sx={{ minWidth: 40, fontWeight: 600 }}
                    />
                    
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    >
                      <Add />
                    </IconButton>
                  </Box>

                  <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                    <Typography variant="subtitle1" fontWeight="700" color="primary">
                      {formatPrice(item.product.price * item.quantity)}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>

      <Box sx={{ 
        mt: 3,
        pt: 3,
        borderTop: '2px solid #FF9900',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
        p: 3,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(255, 153, 0, 0.1)'
      }}>
        <Typography variant="h5" sx={{ color: '#0F1111', fontWeight: 600 }}>Subtotal:</Typography>
        <Typography variant="h4" sx={{ color: '#B12704', fontWeight: 800 }}>
          {formatPrice(getTotalPrice())}
        </Typography>
      </Box>
    </Box>
  );

  const renderShippingForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Full Name"
          value={shippingInfo.name}
          onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Phone Number"
          value={shippingInfo.phone}
          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Delivery Address"
          value={shippingInfo.address}
          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
          multiline
          rows={2}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="City"
          value={shippingInfo.city}
          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
          required
        />
      </Grid>
    </Grid>
  );

  const renderOrderSummary = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      
      <Card sx={{ mb: 2, bgcolor: 'grey.50' }}>
        <CardContent>
          {cartItems.map((item) => (
            <Box key={item.product._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                {item.product.nameEn} × {item.quantity}
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {formatPrice(item.product.price * item.quantity)}
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight="700">
              Total:
            </Typography>
            <Typography variant="subtitle1" fontWeight="700" color="primary">
              {formatPrice(getTotalPrice())}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Shipping Information
      </Typography>
      <Card sx={{ bgcolor: 'grey.50' }}>
        <CardContent>
          <Typography variant="body2"><strong>Name:</strong> {shippingInfo.name}</Typography>
          <Typography variant="body2"><strong>Phone:</strong> {shippingInfo.phone}</Typography>
          <Typography variant="body2"><strong>Address:</strong> {shippingInfo.address}</Typography>
          <Typography variant="body2"><strong>City:</strong> {shippingInfo.city}</Typography>
        </CardContent>
      </Card>
    </Box>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderCartItems();
      case 1:
        return renderShippingForm();
      case 2:
        return renderOrderSummary();
      default:
        return null;
    }
  };

  if (cartItems.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} TransitionComponent={Transition} maxWidth="md" fullWidth aria-hidden={false}>
        <DialogContent sx={{ textAlign: 'center', py: 8, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <ShoppingCart sx={{ fontSize: 120, color: '#FF9900', mb: 3 }} />
          </motion.div>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#0F1111' }}>
            Your cart is empty
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Add some products to get started
          </Typography>
          <Button 
            variant="contained" 
            onClick={onClose}
            size="large"
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FF9900 0%, #FF6B35 100%)',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(255, 153, 0, 0.3)'
            }}
          >
            Continue Shopping
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      aria-hidden={false}
      PaperProps={{
        sx: { 
          borderRadius: { xs: 0, md: 3 }, 
          minHeight: { xs: '100vh', md: '60vh' },
          m: { xs: 0, md: 2 }
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2,
        px: 3,
        pt: 3,
        borderBottom: '2px solid #FF9900',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography 
            variant="h5" 
            fontWeight="700"
            sx={{ 
              fontSize: '1.5rem', 
              color: '#0F1111',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ShoppingCart sx={{ color: '#FF9900', fontSize: 28 }} />
            Shopping Cart 
            <Chip 
              label={`${cartItems.length} items`} 
              sx={{ 
                backgroundColor: '#FF9900', 
                color: 'white', 
                fontWeight: 600,
                ml: 1
              }} 
            />
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Box sx={{ 
        px: { xs: 2, md: 3 }, 
        pb: 2,
        display: { xs: 'none', sm: 'block' }
      }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel={!isMobile}
          orientation={isMobile ? 'vertical' : 'horizontal'}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <Zoom in={true}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.300',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    >
                      {completed ? <CheckCircle /> : index + 1}
                    </Box>
                  </Zoom>
                )}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ 
        px: { xs: 2, md: 3 }, 
        py: 2,
        flex: 1,
        overflow: 'auto'
      }}>
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {getStepContent(activeStep)}
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        pb: 3,
        pt: 2,
        gap: 2,
        borderTop: '2px solid #FF9900',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        {activeStep === 0 && (
          <Button 
            variant="outlined" 
            onClick={clearCart}
            size="large"
            fullWidth={isMobile}
            sx={{ 
              py: 2,
              px: 4,
              fontSize: '1rem',
              fontWeight: 600,
              color: '#DC2626',
              borderColor: '#DC2626',
              borderWidth: 2,
              '&:hover': {
                backgroundColor: '#DC2626',
                color: 'white',
                transform: 'scale(1.02)'
              },
              borderRadius: 2
            }}
          >
            Clear Cart
          </Button>
        )}
        
        {activeStep > 0 && (
          <Button 
            onClick={handleBack}
            size="large"
            fullWidth={isMobile}
            sx={{ 
              py: 2,
              px: 4,
              fontSize: '1rem',
              fontWeight: 600,
              color: '#6B7280',
              '&:hover': {
                backgroundColor: '#F3F4F6',
                transform: 'scale(1.02)'
              },
              borderRadius: 2
            }}
          >
            Back
          </Button>
        )}
        
        {!isMobile && <Box sx={{ flex: 1 }} />}
        
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              activeStep === 1 &&
              (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city)
            }
            size="large"
            fullWidth={isMobile}
            sx={{ 
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FF9900 0%, #FF6B35 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
                transform: 'scale(1.02)'
              },
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(255, 153, 0, 0.3)'
            }}
          >
            Next Step
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<WhatsApp sx={{ fontSize: 24 }} />}
            onClick={handleWhatsAppOrder}
            size="large"
            fullWidth={isMobile}
            sx={{ 
              py: 2,
              px: 4,
              fontSize: '1.2rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)',
                transform: 'scale(1.02)'
              },
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
            }}
          >
            Order via WhatsApp
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModernCartModal;