import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../../models/User';

const router = express.Router();

// Debug endpoint to check OAuth configuration
router.get('/google/debug', (req: Request, res: Response) => {
  res.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    CLIENT_URL: process.env.CLIENT_URL,
    APP_URL: process.env.APP_URL,
    NODE_ENV: process.env.NODE_ENV
  });
});

// @route   GET /api/auth/google
// @desc    Redirect to Google OAuth
// @access  Public
router.get('/google', (req: Request, res: Response) => {
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
    `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
  
  console.log('Google OAuth redirect URI:', redirectUri);
  
  const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=profile email`;
  
  res.redirect(googleAuthURL);
});

// @route   GET /api/auth/google/callback
// @desc    Handle Google OAuth callback
// @access  Public
router.get('/google/callback', async (req: Request, res: Response) => {
  const { code, error } = req.query;
  
  console.log('=== GOOGLE OAUTH CALLBACK DEBUG ===');
  console.log('Code received:', !!code);
  console.log('Error from Google:', error);
  console.log('Full query:', req.query);
  console.log('CLIENT_URL:', process.env.CLIENT_URL);
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...');
  console.log('GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI);

  if (error) {
    console.log('Google OAuth error:', error);
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_${error}`);
  }

  if (!code) {
    console.log('No authorization code received');
    return res.redirect(`${process.env.CLIENT_URL}/login?error=no_code`);
  }

  try {
    // Exchange code for access token with timeout
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
      `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    
    console.log('Token exchange - redirect URI:', redirectUri);
    console.log('Token exchange - code:', code);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });
    clearTimeout(timeoutId);

    const tokenData = await tokenResponse.json();
    console.log('Google token response:', tokenData);

    if (!tokenData.access_token) {
      console.error('=== TOKEN EXCHANGE FAILED ===');
      console.error('Google response:', JSON.stringify(tokenData, null, 2));
      console.error('Status:', tokenResponse.status);
      console.error('Headers:', Object.fromEntries(tokenResponse.headers.entries()));
      return res.redirect(`${process.env.CLIENT_URL}/login?error=token_failed&details=${encodeURIComponent(tokenData.error || 'unknown')}`);
    }

    // Get user info from Google with timeout
    const userController = new AbortController();
    const userTimeoutId = setTimeout(() => userController.abort(), 5000);
    
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      signal: userController.signal,
    });
    clearTimeout(userTimeoutId);

    const googleUser = await userResponse.json();

    // Find or create user (optimized) - validate email format
    if (!googleUser.email || typeof googleUser.email !== 'string') {
      throw new Error('Invalid email from Google');
    }
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: process.env.GOOGLE_OAUTH_PASSWORD || crypto.randomBytes(32).toString('hex'),
        googleId: googleUser.id,
        isGoogleUser: true,
      });
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  } catch (error: any) {
    console.error('Google OAuth error:', error);
    if (error?.name === 'AbortError') {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=timeout`);
    }
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
});

export { router };