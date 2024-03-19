const express = require("express");
const router = express.Router();
const houseValidator = require("../middleware/houseValidator");
const deletedHouseValidator = require("../middleware/deletedHouseValidator");
const rentalRequestValidator = require("../middleware/rentalRequestValidator");
const {
  tenantOnlyAuth,
  adminOrSuperadminAuth,
  landlordAuth,
  brokerAuth,
  superAdminAuth,
  landlordOrBrokerAuth,
  exceptTenantAuth,
} = require("../middleware/authMiddleware");

const propertyController = require("./controllers/propertyController");

// Add file upload endpoint using Multer
router.post("/upload", propertyController.uploadImages);

router.get("/", tenantOnlyAuth, propertyController.getAllAvailableProperty);
router.get(
  "/own-property",
  landlordOrBrokerAuth,
  propertyController.getProperty
);

router.get(
  "/get-all-property",
  adminOrSuperadminAuth,
  propertyController.getAllProperty
);

router.post(
  "/create-property",
  houseValidator,
  landlordOrBrokerAuth,
  propertyController.createProperty
);

// Endpoint for updating an existing property listing
router.put(
  "/:id",
  houseValidator,
  landlordOrBrokerAuth,
  propertyController.updateProperty
);

// Endpoint for deleting an existing property listing
router.delete(
  "/:id",
  houseValidator,
  deletedHouseValidator,
  exceptTenantAuth,
  propertyController.deleteProperty
);

// Endpoint for landlords/brokers to mark a house as available
router.put(
  "/:id/aprove-status",
  houseValidator,
  adminOrSuperadminAuth,
  propertyController.approvalStatusOfProperty
);

module.exports = router;
