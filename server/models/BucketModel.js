const mongoose = require("mongoose");

// bucket schema
const bucketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    objects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ObjectModel",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const BucketModel = mongoose.model("BucketModel", bucketSchema, "buckets");

module.exports = BucketModel;
