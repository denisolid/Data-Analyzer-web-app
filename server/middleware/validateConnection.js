import { body, validationResult } from 'express-validator';

export const validateConnectionRequest = [
  body('type')
    .isIn(['mysql', 'mongodb'])
    .withMessage('Invalid database type'),
  body('host')
    .trim()
    .notEmpty()
    .withMessage('Host is required'),
  body('port')
    .trim()
    .notEmpty()
    .withMessage('Port is required')
    .isNumeric()
    .withMessage('Port must be a number'),
  body('database')
    .trim()
    .notEmpty()
    .withMessage('Database name is required'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }
    next();
  }
];