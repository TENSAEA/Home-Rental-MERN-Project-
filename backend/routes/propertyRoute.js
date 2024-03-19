const express = require("express");
const router = express.Router();
const houseValidator = require("../middleware/houseValidator");
const propertyController = require("../controllers/propertyController");
const { landlordAuth } = require("../middleware/authMiddleware"); // Assuming you have a middleware for landlord authorization

// File upload endpoint
router.post(
  "/upload",
  propertyController.uploadImages,
  propertyController.handleUploadImages
);

// Rental request endpoints
router.post("/:id/rental-requests", propertyController.createRentalRequest);
router.get(
  "/:id/rental-requests",
  propertyController.listRentalRequestsForLandlord
);
router.put(
  "/:id/rental-requests/:requestId",
  propertyController.manageRentalRequest
);

// Property listing endpoints
router.get("/", propertyController.getProperty);
router.get("/get-all-property", propertyController.getAllProperty);
router.post(
  "/create-property",
  houseValidator,
  propertyController.createProperty
);
router.put("/:id", houseValidator, propertyController.updateProperty);
router.delete("/:id", houseValidator, propertyController.deleteProperty);

// Property approval status endpoint
router.put(
  "/:id/approve-status",
  houseValidator,
  propertyController.approvalStatusOfProperty
);

// Endpoint to mark a house as unavailable
router.post(
  "/houses/:id/unavailable",
  landlordAuth,
  propertyController.markHouseUnavailable
);

module.exports = router;
