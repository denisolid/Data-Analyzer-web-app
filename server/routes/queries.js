import express from 'express';
import { body } from 'express-validator';
import { executeQuery } from '../utils/queryExecutor.js';

const router = express.Router();

// Execute query
router.post('/execute', [
  body('connectionId').notEmpty().withMessage('Connection ID is required'),
  body('query').notEmpty().withMessage('Query is required'),
], async (req, res, next) => {
  try {
    const { connectionId, query } = req.body;
    
    // In a real app, fetch connection details from database
    const connection = {}; // Placeholder
    
    const result = await executeQuery(connection, query);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export const queriesRouter = router;