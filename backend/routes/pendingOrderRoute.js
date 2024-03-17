const express = require("express");
const router = express.Router();
const { renterOnly } = require("../middleware/authMiddleware");
const pendingOrderController = require("../controllers/pendingOrderController");

router.post(
  "/pending-orders",
  renterOnly,
  pendingOrderController.createPendingOrder
);
router.put(
  "/pending-orders/:id",
  renterOnly,
  pendingOrderController.updatePendingOrder
);
router.delete(
  "/pending-orders/:id",
  renterOnly,
  pendingOrderController.deletePendingOrder
);
router.get(
  "/pending-orders/:id",
  renterOnly,
  pendingOrderController.getPendingOrder
);
router.get(
  "/landlord/:landlordId/pending-orders",
  renterOnly,
  pendingOrderController.getAllPendingOrdersForLandlord
);

router.post(
  "/pending-orders/:id/accept",
  renterOnly,
  pendingOrderController.acceptPendingOrder
);
router.post(
  "/pending-orders/:id/reject",
  renterOnly,
  pendingOrderController.rejectPendingOrder
);
router.post(
  "/pending-orders/:id/counter-offer",
  renterOnly,
  pendingOrderController.counterOfferPendingOrder
);

// ... (other routes)
module.exports = router;
