const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional, only if a broker is involved
    location: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    photos: [{ type: String }], // URLs to images
    status: {
      type: String,
      enum: ["available", "rented", "unavailable"],
      default: "available",
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    // Add other relevant house details here
  },
  { timestamps: true }
);

// Add a method to the houseSchema for checking availability if it doesn't exist
houseSchema.methods.isAvailable = function () {
  return this.status === "available";
};

module.exports = mongoose.model("House", houseSchema);
