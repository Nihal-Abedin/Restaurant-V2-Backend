const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An Item must have a name."],
    unique: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "category",
  },
});

const itemModel = mongoose.model("Item", itemSchema);

module.exports = itemModel;
