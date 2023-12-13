const express = require("express");
const router = express.Router();
const bucketController = require("../controller/bucketController");

// get buckets for user
router.get("/", bucketController.getBuckets);

// add bucket for user
router.post("/", bucketController.addBucket);

module.exports = router;
