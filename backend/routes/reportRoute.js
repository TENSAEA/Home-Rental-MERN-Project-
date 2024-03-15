const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reportController");

// Rename to reportRoute.js and update the controller accordingly
router.post("/reports", reportController.create);
router.get("/reports/:id", reportController.show);
router.put("/reports/:id", reportController.update);

module.exports = router;
