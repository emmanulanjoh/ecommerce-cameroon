import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

const router = express.Router();

// @route   GET /api/auth/google
// @desc    Redirect to Google OAuth
// @access  Public
router.get('/google', (req: Request, res: Response) => {
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
    `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
  
  const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=code&` +
    `scope=profile email`;
  
  res.redirect(googleAuthURL);
});

// @route   GET /api/auth/google/callback
// @desc    Handle Google OAuth callback
// @access  Public
router.get('/google/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=no_code`);
  }

  try {
    // Exchange code for access token
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
      `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=token_failed`);
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userResponse.json();

    // Find or create user
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        password: 'google_oauth', // Placeholder password
        googleId: googleUser.id,
        isGoogleUser: true,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
});

export { router };