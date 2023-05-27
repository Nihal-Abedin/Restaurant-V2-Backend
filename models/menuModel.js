const mongoose = require("mongoose");
const Restaurant = require("../models/restaurantModel");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A menu must have a name."],
    },
    menu_items: {
      type: [String],
      required: [true, "Must provide menu items."],
    },
    total_items: {
      type: Number,
    },
    average_ratings: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
    },
    total_reviews: {
      type: Number,
      default: 1,
    },
    restaurant: {
      type: mongoose.Schema.ObjectId,
      ref: "Restaurant",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// virtuals

menuSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "menu",
});

// prev save middlewares

menuSchema.pre("save", function (next) {
  this.total_items = this.menu_items.length;
  next();
});

// statics method

menuSchema.statics.calculateRating = async function (resId) {
  const stats = await this.aggregate([
    {
      $match: { restaurant: resId },
    },
    {
      $group: {
        _id: "restaurant",
        nMenus: { $sum: 1 },
        avgRating: { $avg: "$average_ratings" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Restaurant.findByIdAndUpdate(resId, {
      total_reviews: stats[0].nMenus,
      average_ratings: stats[0].avgRating,
    });
  } else {
    await Menu.findByIdAndUpdate(menuId, {
      total_reviews: stats[0].nMenus,
      average_ratings: stats[0].avgRating,
    });
  }
};
// onSave menu doc middleware for ratings
menuSchema.post("save", function () {
  this.constructor.calculateRating(this.restaurant);
});

// Query Middleware

menuSchema.pre(/^findOneAnd/, async function (next) {
  // this.query
  this.query = await this.model.findOne(this.getQuery());
  next();
});

menuSchema.post(/^findOneAnd/, async function () {
  await this.query.constructor.calculateRating(this.query.restaurant);
});

const menuModel = mongoose.model("Menu", menuSchema);

module.exports = menuModel;
