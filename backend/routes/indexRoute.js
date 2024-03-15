const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

// Home route
router.get("/", homeController.index);

module.exports = router;
