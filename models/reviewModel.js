const mongoose = require("mongoose");
const Menu = require("../models/menuModel");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Please give your review."],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  menu: {
    type: mongoose.Schema.ObjectId,
    ref: "Menu",
  },
});

//  static methods

reviewSchema.statics.calculateRating = async function (menuId) {
  const stats = await this.aggregate([
    {
      $match: { menu: menuId },
    },
    {
      $group: {
        _id: "$menu",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Menu.findByIdAndUpdate(menuId, {
      total_reviews: stats[0].nRating,
      average_ratings: stats[0].avgRating,
    });
  } else {
    await Menu.findByIdAndUpdate(menuId, {
      total_reviews: stats[0].nRating,
      average_ratings: stats[0].avgRating,
    });
  }
};
// Post save middleware

reviewSchema.post("save", function () {
  this.constructor.calculateRating(this.menu);
});

// Query Middleware

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.query = await this.model.findOne(this.getQuery());
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.query.constructor.calculateRating(this.query.menu);
});

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
