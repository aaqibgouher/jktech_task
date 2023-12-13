const mongoose = require("mongoose");

// token schema
const tokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TokenModel = mongoose.model("TokenModel", tokenSchema, "tokens");

module.exports = TokenModel;
