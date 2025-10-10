import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../../models/Admin';
import { sanitizeForHtml } from '../../utils/sanitize';


const router = express.Router();

// Authentication middleware
const authMiddleware = async (req: Request, res: Response, next: Function) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    // Add admin from payload to request
    (req as any).admin = decoded.admin;
    next();
  } catch (err) {
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