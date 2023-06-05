const mongoose = require("mongoose");
const Restaurant = require("../models/restaurantModel");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A menu must have a name."],
    },
    menu_items: {
      type: [mongoose.Schema.ObjectId],
      required: [true, "Must provide menu items."],
      ref: "Item",
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
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "A menu must belong to a category."],
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
  console.log(resId);
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
      total_menus: stats[0].nMenus,
      average_ratings: stats[0].avgRating,
    });
  } else {
    await Restaurant.findByIdAndUpdate(resId, {
      total_menus: 0,
      average_ratings: 4.5,
    });
  }
};
// onSave menu doc middleware for ratings
menuSchema.post("save", function () {
  this.constructor.calculateRating(this.restaurant);
});

// Query Middleware
menuSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "category",
    select: "name ",
  })
    .populate({
      path: "menu_items",
      select: "name ",
    })
    .populate({
      path: "restaurant",
      select: "name",
    })
    .populate({
      path: "reviews",
      select: "review user rating -menu",
    });
});
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
