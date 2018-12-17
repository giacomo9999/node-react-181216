const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// establish structure of database
const dataSchema = new Schema(
  {
    id: Number,
    message: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", dataSchema);
