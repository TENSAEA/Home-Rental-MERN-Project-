const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const adminController = {
  createAdmin: async (req, res) => {
    // Logic to create an admin user
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: "admin",
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  deleteAdmin: async (req, res) => {
    // Logic to delete an admin user
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  blockUser: async (req, res) => {
    // Logic to block a user
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.isBlocked = true;
      await user.save();
      res.status(200).json({ message: "User blocked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  unblockUser: async (req, res) => {
    // Logic to unblock a user
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.isBlocked = false;
      await user.save();
      res.status(200).json({ message: "User unblocked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },
};

module.exports = adminController;
