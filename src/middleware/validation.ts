import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Product validation
export const validateProduct = [
  body('nameEn').trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be 2-100 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().isLength({ min: 2, max: 50 }).withMessage('Category must be 2-50 characters'),
  body('stockQuantity').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('descriptionEn').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  handleValidationErrors
];

// User validation
export const validateUser = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone('any').withMessage('Valid phone number required'),
  handleValidationErrors
];

// Order validation
export const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('items.*.product').isMongoId().withMessage('Valid product ID required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be positive'),
  body('shippingAddress.name').trim().isLength({ min: 2 }).withMessage('Name required'),
  body('shippingAddress.phone').isMobilePhone('any').withMessage('Valid phone required'),
  body('shippingAddress.street').trim().isLength({ min: 5 }).withMessage('Address required'),
  body('shippingAddress.city').trim().isLength({ min: 2 }).withMessage('City required'),
  handleValidationErrors
];

// Review validation
export const validateReview = [
  body('product').isMongoId().withMessage('Valid product ID required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters'),
  handleValidationErrors
];

// ID parameter validation
export const validateId = [
  param('id').isMongoId().withMessage('Valid ID required'),
  handleValidationErrors
];

// Query validation
export const validateQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('category').optional().trim().isLength({ max: 50 }).withMessage('Category too long'),
  handleValidationErrors
];

// Contact validation
export const validateContact = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('subject').trim().isLength({ min: 5, max: 100 }).withMessage('Subject must be 5-100 characters'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be 10-1000 characters'),
  handleValidationErrors
];