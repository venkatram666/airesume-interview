const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/*
REGISTER
*/
router.post(
  "/register",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          message: "Fill all fields",
        });
      }

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res.status(400).json({
          message:
            "User already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          name,
          email,
          password:
            hashedPassword,
        });

      res.status(201).json({
        message:
          "Registration Successful",
        user,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/*
LOGIN
*/
router.post(
  "/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (
        !user ||
        !(await bcrypt.compare(
          password,
          user.password
        ))
      ) {
        return res.status(400).json({
          message:
            "Invalid Credentials",
        });
      }

      const token =
        jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/*
PROFILE
*/
router.get(
  "/profile",
  auth,
  async (req, res) => {
    res.json({
      message:
        "Protected Route Accessed",
      userId: req.user.id,
    });
  }
);

module.exports = router;