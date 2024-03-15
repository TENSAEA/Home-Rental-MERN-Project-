const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["renter", "landlord", "broker", "admin", "superadmin"],
      required: true,
    },
    isBlocked: { type: Boolean, default: false },
    image: { type: String, required: false },
    // Add other relevant user details here
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
