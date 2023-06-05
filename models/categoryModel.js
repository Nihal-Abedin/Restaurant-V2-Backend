const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A category must have a name."],
      uniquie: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
categorySchema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "category",
});
const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
