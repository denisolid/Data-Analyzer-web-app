import express from 'express';
import { body, validationResult } from 'express-validator';
import { encryptConnectionDetails, testConnection } from '../utils/connectionManager.js';

const router = express.Router();

// Validate connection request
const validateConnection = [
  body('name').trim().notEmpty().withMessage('Connection name is required'),
  body('type').isIn(['mysql', 'mongodb']).withMessage('Invalid database type'),
  body('host').trim().notEmpty().withMessage('Host is required'),
  body('port').isNumeric().withMessage('Port must be a number'),
  body('database').trim().notEmpty().withMessage('Database name is required'),
  body('username').trim().notEmpty().withMessage('Username is required'),
];

// Create new connection
router.post('/', validateConnection, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const connectionDetails = await encryptConnectionDetails({
      ...req.body,
      userId: req.user.id
    });

    const isValid = await testConnection(connectionDetails);
    if (!isValid) {
      return res.status(400).json({ error: 'Unable to connect to database' });
    }

    // Store connection details securely
    // In a real app, save to database here

    res.status(201).json({ message: 'Connection created successfully' });
  } catch (error) {
    next(error);
  }
});

// Get user's connections
router.get('/', async (req, res, next) => {
  try {
    // In a real app, fetch from database
    res.json([]);
  } catch (error) {
    next(error);
  }
});

export const connectionsRouter = router;