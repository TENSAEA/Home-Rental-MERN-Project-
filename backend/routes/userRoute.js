const express = require("express");
const router = express.Router();

const userController = require("./controllers/userController");

router.post("/register", userController.register); // Add password hashing here
router.post("/login", userController.login); // Implement JWT token generation here
// Add forgot password endpoints
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);
// Add user profile update endpoint
router.put("/profile/:id", userController.updateProfile);
// Add user deletion endpoint
router.delete("/:id", userController.deleteUser);
// Add user search/filtering endpoint
router.get("/", userController.searchUsers);
// Add endpoints for blocking/unblocking users
router.post("/block/:id", userController.blockUser);
router.post("/unblock/:id", userController.unblockUser);

module.exports = router;
