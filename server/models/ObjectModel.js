const mongoose = require("mongoose");

// object schema
const objectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    bucket: {
      type: mongoose.Types.ObjectId,
      ref: "BucketModel",
      required: true,
    },
    file: {
      type: Object,
      default: {},
    },
    link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ObjectModel = mongoose.model("ObjectModel", objectSchema, "objects");

module.exports = ObjectModel;
