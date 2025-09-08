import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';
import axios from 'axios';
import { sanitizeForLog } from '../utils/sanitize';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  generateWhatsAppMessage: () => string;
  createOrder: (shippingAddress: any, isAuthenticated: boolean, userToken?: string) => Promise<string>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number = 1) => {
    console.log('addToCart called with:', sanitizeForLog(product.nameEn || ''), 'quantity:', sanitizeForLog(String(quantity)));
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product._id === product._id);
      
      if (existingItem) {
        console.log('Product already in cart, updating quantity');
        return prevItems.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        console.log('Adding new product to cart');
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const generateWhatsAppMessage = () => {
    if (cartItems.length === 0) return '';
    
    const businessName = 'Findall Sourcing';
    let message = `Hello ${businessName}! I would like to order the following products:\n\n`;
    
    cartItems.forEach((item, index) => {
      const productName = item.product.nameEn;
      const price = new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF'
      }).format(item.product.price);
      
      message += `${index + 1}. ${productName}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ${price} each\n`;
      message += `   Subtotal: ${new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF'
      }).format(item.product.price * item.quantity)}\n\n`;
    });
    
    const total = new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(getTotalPrice());
    
    message += `Total Amount: ${total}\n\n`;
    message += `Please confirm availability and delivery details. Thank you!`;
    
    return encodeURIComponent(message);
  };

  const createOrder = async (shippingAddress: any, isAuthenticated: boolean, userToken?: string): Promise<string> => {
    try {
      if (isAuthenticated && userToken) {
        // Validate product IDs to prevent NoSQL injection
        const validatedItems = cartItems.map(item => {
          if (!item.product._id || typeof item.product._id !== 'string' || !/^[a-fA-F0-9]{24}$/.test(item.product._id)) {
            throw new Error('Invalid product ID');
          }
          return {
            product: item.product._id,
            name: sanitizeForLog(item.product.nameEn || ''),
            price: Number(item.product.price) || 0,
            quantity: Number(item.quantity) || 1,
            image: item.product.images?.[0] || ''
          };
        });

        const orderData = {
          items: validatedItems,
          shippingAddress,
          notes: 'Order placed via WhatsApp'
        };

        const response = await axios.post('/api/orders', orderData, {
          headers: { Authorization: `Bearer ${userToken}` }
        });

        const orderId = response.data._id;
        clearCart();
        return orderId;
      } else {
        const tempOrderId = 'GUEST_' + Date.now();
        clearCart();
        return tempOrderId;
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    generateWhatsAppMessage,
    createOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};