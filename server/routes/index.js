const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// import all routes here
const bucketRoutes = require("./bucketRoutes");
const objectRoutes = require("./objectRoutes");
const userRoutes = require("./userRoutes");

// use routes
router.use("/buckets", authMiddleware.isAuthenticated, bucketRoutes);
router.use("/objects", authMiddleware.isAuthenticated, objectRoutes);
router.use("/user", userRoutes);

// export
module.exports = router;
