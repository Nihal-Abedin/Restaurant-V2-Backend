const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "A restaurant must have a name."],
    },
    average_ratings: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
    },
    total_menus: {
      type: Number,
      default: 1,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtuals

restaurantSchema.virtual("menus", {
  ref: "Menu",
  localField: "_id",
  foreignField: "restaurant",
});

const restaurantModel = mongoose.model("Restaurant", restaurantSchema);
// restaurantModel
//   .updateMany({}, { $rename: { total_reviews: "total_menus" } })
//   .then(() => console.log("Documents updated successfully."))
//   .catch((err) => console.error("Error updating documents:", err));
module.exports = restaurantModel;
