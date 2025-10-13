import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../../models/Admin';
import { sanitizeForHtml } from '../../utils/sanitize';


const router = express.Router();

// Authentication middleware
const authMiddleware = async (req: Request, res: Response, next: Function) => {
  console.log('🔐 Auth middleware called');
  
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('🎫 Token present:', !!token);

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    console.log('🔍 Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    console.log('✅ Token verified for admin:', decoded.admin?.id);
    
    (req as any).admin = decoded.admin;
    next();
  } catch (err) {
    console.log('❌ Token verification failed:', (err as Error).message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Create and sign JWT token
    const payload = {
      admin: {
        id: admin.id,
        username: admin.username,
        isAdmin: true
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            _id: sanitizeForHtml(admin.id),
            username: sanitizeForHtml(admin.username),
            email: sanitizeForHtml(admin.email),
            isAdmin: true
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/profile
// @desc    Get current admin profile
// @access  Private
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById((req as any).admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json({
      _id: admin.id,
      username: admin.username,
      email: admin.email,
      isAdmin: true
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current admin
// @access  Private
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    // This route is protected by auth middleware
    // which adds the admin to the request
    const admin = await Admin.findById((req as any).admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json({
      _id: admin.id,
      username: admin.username,
      email: admin.email,
      isAdmin: true
    });
  } catch (err) {
    console.error('Get admin error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router, authMiddleware };
