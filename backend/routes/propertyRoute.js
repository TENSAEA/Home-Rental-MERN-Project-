const express = require("express");
const router = express.Router();

const propertyController = require("./controllers/propertyController");

// Add file upload endpoint using Multer
router.post("/upload", propertyController.uploadImages);
// Add endpoints for rental requests
router.post("/:id/rental-requests", propertyController.createRentalRequest);
router.get("/:id/rental-requests", propertyController.listRentalRequests);
router.put(
  "/:id/rental-requests/:requestId",
  propertyController.manageRentalRequest
);

// Endpoint for creating a new property listing
router.post("/", propertyController.createProperty);

// Endpoint for updating an existing property listing
router.put("/:id", propertyController.updateProperty);

// Endpoint for deleting an existing property listing
router.delete("/:id", propertyController.deleteProperty);

// Endpoint for landlords/brokers to mark a house as unavailable
router.put("/:id/mark-unavailable", propertyController.markHouseUnavailable);

// Endpoint for landlords/brokers to mark a house as available
router.put("/:id/mark-available", propertyController.markHouseAvailable);

module.exports = router;
