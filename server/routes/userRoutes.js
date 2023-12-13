const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

// register
router.post("/register", userController.register);

// login
router.post("/login", userController.login);

// logout
router.post("/logout", authMiddleware.isAuthenticated, userController.logout);

module.exports = router;
