import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Admin from '../models/Admin';

// User authentication middleware
export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    // Check if it's a user token
    if (decoded.userId) {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      (req as any).user = user;
      return next();
    }
    
    return res.status(401).json({ message: 'Invalid token type' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin authentication middleware
export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    // Check if it's an admin token
    if (decoded.admin) {
      const admin = await Admin.findById(decoded.admin.id);
      if (!admin) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      (req as any).admin = admin;
      return next();
    }
    
    return res.status(401).json({ message: 'Admin access required' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Flexible auth middleware (accepts both user and admin tokens)
export const flexibleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    // Check for user token
    if (decoded.userId) {
      const user = await User.findById(decoded.userId);
      if (user) {
        (req as any).user = user;
        return next();
      }
    }
    
    // Check for admin token
    if (decoded.admin) {
      const admin = await Admin.findById(decoded.admin.id);
      if (admin) {
        (req as any).user = { _id: admin._id, name: admin.username, isAdmin: true };
        return next();
      }
    }
    
    return res.status(401).json({ message: 'Invalid token' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};