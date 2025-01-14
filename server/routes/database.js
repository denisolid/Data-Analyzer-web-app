import express from "express";
import { body } from "express-validator";
import { validateConnectionRequest } from "../middleware/validateConnection.js";
import { authenticate } from "../middleware/auth.js";
import { testConnection, executeQuery } from "../controllers/database.js";

const router = express.Router();

// Test database connection
router.post("/test", authenticate, validateConnectionRequest, testConnection);

// Execute query
router.post(
  "/query",
  authenticate,
  [
    body("connectionId").notEmpty().withMessage("Connection ID is required"),
    body("query").notEmpty().withMessage("Query is required"),
  ],
  executeQuery
);

export default router;
