const express = require("express");
const router = express.Router();
const houseValidator = require("../middleware/houseValidator");
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
router.get("/", propertyController.getProperty);

router.get("/get-all-property", propertyController.getAllProperty);

router.post(
  "/create-property",
  houseValidator,
  propertyController.createProperty
);

// Endpoint for updating an existing property listing
router.put("/:id", houseValidator, propertyController.updateProperty);

// Endpoint for deleting an existing property listing
router.delete("/:id", houseValidator, propertyController.deleteProperty);

// Endpoint for landlords/brokers to mark a house as available
router.put(
  "/:id/aprove-status",
  houseValidator,
  propertyController.approvalStatusOfProperty
);

module.exports = router;
