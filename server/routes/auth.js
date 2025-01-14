import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import crypto from "crypto";
import User from "../models/User.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/email.js";

const router = express.Router();

// Signup route
router.post(
  "/signup",
  [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("email").trim().isEmail().withMessage("Invalid email address"),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { username, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username or email already exists",
        });
      }

      // Create verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Create user
      const user = new User({
        username,
        email,
        password,
        verificationToken,
        isVerified: true, // For testing purposes, auto-verify users
      });

      await user.save();

      // Generate JWT immediately
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({
        message: "Registration successful",
        token,
        user: { id: user._id, username: user.username },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Server error during signup" });
    }
  }
);

// Login route
router.post(
  "/login",
  [body("username").trim().notEmpty(), body("password").trim().notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Invalid input" });
      }

      const { username, password } = req.body;

      // Check for admin bypass
      if (username === "admin" && password === "admin") {
        const token = "admin-mock-token";
        return res.json({
          token,
          user: { id: "admin", username: "admin" },
        });
      }

      // Find user by username or email
      const user = await User.findOne({
        $or: [
          { username: username },
          { email: username }, // Allow login with email
        ],
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: { id: user._id, username: user.username },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  }
);

export default router;
