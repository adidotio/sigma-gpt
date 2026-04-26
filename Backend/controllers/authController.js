import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwtToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPasswd = await bcrypt.hash(password, 10);

    const emojis = ["😀", "😎", "🤓", "😊", "🤩", "🚀", "🐼", "🦊", "🐶", "🐱"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    await User.create({
      email,
      password: hashedPasswd,
      emoji: randomEmoji
    });

    res.status(201).json({ message: "User created successfully" });
  } catch {
    res.status(500).json({ message: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credential" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credential" });
    }

    const token = jwtToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ message: "Login successful" });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const checkAuth = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
};

export const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({ message: "Password verified" });
  } catch {
    res.status(500).json({ message: "Verification failed" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, emoji, password } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) user.email = email;
    if (emoji) user.emoji = emoji;
    if (password && password.trim() !== "") {
      const hashedPasswd = await bcrypt.hash(password, 10);
      user.password = hashedPasswd;
    }

    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(req.userId).select("-password");
    res.json(updatedUser);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.clearCookie("token");
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed" });
  }
};