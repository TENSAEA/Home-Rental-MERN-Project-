const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Rename to pendingOrderRoute.js and update the controller accordingly
router.post("/pending-orders", pendingOrderController.create);
router.get("/pending-orders/:id", pendingOrderController.show);
router.put("/pending-orders/:id", pendingOrderController.update);
router.delete("/pending-orders/:id", pendingOrderController.cancel);

module.exports = router;
