const express = require("express");
const router = express.Router();
const objectController = require("../controller/objectController");

// fetches buckets with objects for a user
router.get("/", objectController.getObjects);

// fetches object by id
router.get("/:objectId", objectController.getObject);

// delete an object by id
router.delete("/:objectId", objectController.deleteObject);

// upload an object
/*
    Payload: 1. bucketId (in params), 2. Body -> form-data with key file: and upload the file.
    Make sure, key should be file.
 */
router.post("/", objectController.addObject);

// download an object
router.get("/download/:objectId", objectController.downloadObject);

module.exports = router;
