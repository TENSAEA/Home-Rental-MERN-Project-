const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/", paymentController.process);
router.get("/:id", paymentController.show);

module.exports = router;
