import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Order from '../../models/Order';
import User from '../../models/User';
import { EmailService } from '../../services/email';
import { sanitizeForLog, sanitizeForHtml, sanitizeHtml, sanitizeMongoQuery } from '../../utils/sanitize';
import { csrfProtection } from '../../middleware/csrf';

const router = express.Router();

import { userAuth } from '../../middleware/auth';

// ADMIN ROUTES - Must come before parameterized routes
// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Public (handled by admin route protection)
router.get('/admin/all', async (req: Request, res: Response) => {
  try {
    console.log('Admin orders endpoint called');

    const { status, page = 1, limit = 10 } = req.query;
    const query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'nameEn nameFr images price')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Order.countDocuments(query);

    console.log(`Found ${sanitizeForLog(orders.length)} orders for admin`);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// @route   PUT /api/orders/admin/:id/status
// @desc    Update order status (Admin only)
// @access  Public (handled by admin route protection)
router.put('/admin/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    console.log(`📝 Updating order ${sanitizeForLog(req.params.id)} status to: ${sanitizeForLog(status)}`);
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.notes = notes;
    if (status === 'delivered') order.deliveredAt = new Date();

    await order.save();
    await order.populate('user', 'name email phone');
    await order.populate('items.product', 'nameEn nameFr images price');

    console.log(`Order ${sanitizeForLog(req.params.id)} updated successfully`);
    res.json(order);
  } catch (error: any) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// USER ROUTES
// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', userAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'items.product',
        select: 'nameEn nameFr images price',
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', userAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { items, shippingAddress, notes } = req.body;

    // Calculate total
    const totalAmount = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );

    const order = new Order({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      notes,
      paymentMethod: 'whatsapp'
    });

    await order.save();
    await order.populate('items.product', 'nameEn nameFr images price');

    // Send confirmation email
    const user = await User.findById(userId);
    if (user?.email) {
      await EmailService.sendOrderConfirmation(user.email, order);
    }

    res.status(201).json(order);
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', userAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const order = await Order.findOne({ _id: req.params.id, user: userId })
      .populate('items.product', 'nameEn nameFr images price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});



export { router };