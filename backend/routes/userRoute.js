const express = require("express");
const {
  userAuth,
  adminsAuth,
  superAdminAuth,
  adminOrSuperAdminAuth,
} = require("../middleware/authMiddleware");
const router = express.Router();
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const User = require("../model/userModel");
const multer = require("multer");
const storage = multer.memoryStorage(); // For temporary storage; use multer.diskStorage() for permanent storage
const upload = multer({ storage: storage });

router.post(
  "/uploadImage",
  userAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      // Process and store the image, then update the user's image field
      const imageUrl = await processAndStoreImage(req.file);
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { image: imageUrl },
        { new: true }
      );
      res.status(200).json({ message: "Image uploaded successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.post("/register", userController.register);
router.post("/login", userController.login);
// Add forgot password endpoints
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);
// Add user profile update endpoint
router.put("/profile/:id", userAuth, userController.updateProfile);
// Add user deletion endpoint
router.delete("/:id", adminOrSuperAdminAuth, userController.deleteUser);
// Add user search/filtering endpoint
router.get("/", adminOrSuperAdminAuth, userController.searchUsers);
// Add endpoints for blocking/unblocking users
router.post("/block/:id", adminOrSuperAdminAuth, userController.blockUser);
router.post("/unblock/:id", adminOrSuperAdminAuth, userController.unblockUser);

// Super Admin exclusive user creation
router.post("/create-admin", superAdminAuth, adminController.createAdmin);

// Super Admin exclusive user deletion - if they are the only ones who can delete admins
router.delete("/admin/:id", superAdminAuth, adminController.deleteAdmin);

// Super Admin exclusive user blocking/unblocking - if this is a super admin function
router.post("/super/block/:id", superAdminAuth, adminController.blockUser);
router.post("/super/unblock/:id", superAdminAuth, adminController.unblockUser);
module.exports = router;
