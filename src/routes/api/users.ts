import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { validateUser } from '../../middleware/validation';
import { sanitizeForLog, sanitizeForHtml } from '../../utils/sanitize';


const router = express.Router();

// @route   GET /api/users/test
// @desc    Test endpoint
// @access  Public
router.get('/test', (req: Request, res: Response) => {
  res.json({
    message: 'Users API is working',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    mongoConnected: require('mongoose').connection.readyState === 1
  });
});

// Generate JWT Token
const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/users/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Registration attempt:', { 
      body: req.body, 
      env: process.env.NODE_ENV,
      mongoConnected: require('mongoose').connection.readyState === 1
    });
    
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Name, email, and password are required' 
      });
    }

    // Validate email format and check if user exists
    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password
    });

    await user.save();
    console.log('✅ User created successfully:', user._id);

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message || 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: error.message || 'Login failed' 
    });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin
    });
  } catch (error: any) {
    console.error('Profile error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    const { name, phone, address } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: error.message || 'Profile update failed' 
    });
  }
});

export { router };