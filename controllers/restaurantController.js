const catchAsync = require("../utils/catchAsync");
const Restaurant = require("../models/restaurantModel");
const Menu = require("../models/menuModel");
const AppError = require("../utils/appError");

exports.createRes = catchAsync(async (req, res, next) => {
  const rest = await Restaurant.create({ name: req.body.name });

  res.status(201).json({
    status: 201,
    message: "success",
    data: { data: { restaurant: rest } },
  });
});
exports.getAllRes = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.find();
  res.status(200).json({
    status: 200,
    message: "success",
    total_restaurants: restaurants.length,
    data: { data: restaurants },
  });
});

exports.getRes = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id).populate({
    path: "menus",
  });

  if (!restaurant) {
    return next(new AppError("No Restaurant with this Id.", 400));
  }

  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      data: restaurant,
    },
  });
});

exports.updateRes = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true, runValidators: true }
  );

  if (!restaurant) {
    return next(new AppError("No Restaurant with this Id.", 400));
  }
  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      data: restaurant,
    },
  });
});

exports.createMenuForRes = catchAsync(async (req, res, next) => {
  if (req.params.id) {
    req.body.restaurant = req.params.id;
  } else {
    req.params.id = req.body.restaurant;
  }

  const rest = await Restaurant.findById(req.params.id);
  if (!rest) {
    return next(new AppError("No Restaurant with this Id.", 400));
  }

  const menu = await Menu.create(req.body);

  res.status(201).json({
    status: 201,
    message: "success",
    data: {
      data: menu,
    },
  });
});
