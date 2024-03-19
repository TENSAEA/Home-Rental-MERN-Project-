const express = require("express");
const router = express.Router();
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

const rentalRequestCntroller = require("../controllers/rentalRequestCntroller");
router.post(
  "/:id/rental-requests",
  rentalRequestValidator,
  tenantOnlyAuth,
  rentalRequestCntroller.createRentalRequest
);
router.get(
  "/:id/rental-requests",
  landlordOrBrokerAuth,
  rentalRequestCntroller.listRentalRequests
);
router.put(
  "/:id/rental-requests/:requestId",
  landlordOrBrokerAuth,
  rentalRequestCntroller.manageRentalRequest
);
