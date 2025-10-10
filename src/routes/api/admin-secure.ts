import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../../models/Admin';
import { secureAdminAuth, adminCSRFProtection, adminRateLimit, generateAdminToken } from '../../middleware/admin-security';
import { sanitizeInput } from '../../utils/sanitize';

const router = express.Router();

// Admin login with secure session
router.post('/login', adminRateLimit(5, 15 * 60 * 1000), async (req, res) => {
  try {
    const { username, password } = req.body;

    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    if (!sanitizedUsername || !sanitizedPassword) {
      return res.status(400).json({ 
        message: 'Username and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Find admin
    const admin = await Admin.findOne({ 
      $or: [
        { username: sanitizedUsername },
        { email: sanitizedUsername }
      ]
    });

    if (!admin || !admin.isActive) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(sanitizedPassword);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate secure session token
    const sessionToken = generateAdminToken();
    admin.sessionToken = sessionToken;
    admin.lastLogin = new Date();
    await admin.save();

    // Set session
    req.session!.adminId = admin._id.toString();
    req.session!.adminToken = sessionToken;

    // Generate JWT token
    const jwtToken = jwt.sign(
      { 
        admin: { 
          id: admin._id,
          username: admin.username 
        }
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token: jwtToken,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      code: 'SERVER_ERROR'
    });
  }
});

// Admin logout
router.post('/logout', secureAdminAuth, async (req, res) => {
  try {
    const admin = (req as any).admin;
    
    // Clear session token
    admin.sessionToken = null;
    await admin.save();

    // Destroy session
    req.session?.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ 
      message: 'Server error during logout',
      code: 'SERVER_ERROR'
    });
  }
});

// Get admin profile
router.get('/profile', secureAdminAuth, (req, res) => {
  const admin = (req as any).admin;
  res.json({
    success: true,
    admin: {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      lastLogin: admin.lastLogin
    }
  });
});

// Update admin profile
router.put('/profile', secureAdminAuth, adminCSRFProtection, adminRateLimit(), async (req, res) => {
  try {
    const admin = (req as any).admin;
    const { username, email, currentPassword, newPassword } = req.body;

    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email);

    if (sanitizedUsername) admin.username = sanitizedUsername;
    if (sanitizedEmail) admin.email = sanitizedEmail;

    // Handle password change
    if (currentPassword && newPassword) {
      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ 
          message: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        });
      }
      admin.password = newPassword;
    }

    await admin.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Admin profile update error:', error);
    res.status(500).json({ 
      message: 'Server error updating profile',
      code: 'SERVER_ERROR'
    });
  }
});

export { router };