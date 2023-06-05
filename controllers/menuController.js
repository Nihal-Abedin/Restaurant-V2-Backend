const catchAsync = require("../utils/catchAsync");
const Menu = require("../models/menuModel");
const Review = require("../models/reviewModel");

const AppError = require("../utils/appError");

exports.setUserBody = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};
exports.getAllMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.find();

  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      menu,
    },
  });
});
exports.getMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.findById(req.params.menuId);

  if (!menu) {
    return next(new AppError("No menu With this Id.", 400));
  }

  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      data: menu,
    },
  });
});
exports.updateMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.findByIdAndUpdate(
    req.params.menuId,
    {
      name: req.body.name,
    },
    { new: true, runValidators: true }
  );

  if (!menu) {
    return next(new AppError("No menu with this Id", 400));
  }
  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      data: menu,
    },
  });
});

exports.createReviewForMenu = catchAsync(async (req, res, next) => {
  // menu/:menuId/review
  // console.log("CREATE REVIEW FOR A MENU");
  const menu = await Menu.findById(req.params.menuId);
  if (!menu) {
    return next(new AppError("No menu with this Id.", 400));
  }
  const review = await Review.create({
    ...req.body,
    menu: req.params.menuId,
    user: req.user.id,
  });

  res.status(201).json({
    status: 201,
    message: "success",
    data: {
      data: review,
    },
  });
});
exports.deleteMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.findByIdAndDelete(req.params.menuId);
  if (!menu) {
    return next(new AppError("No menu with this Id.", 400));
  }
  res.status(200).json({
    status: 200,
    message: "Successfullt deleted!",
  });
});

exports.getAllRreviewForMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.findById(req.params.menuId);
  if (!menu) {
    return next(new AppError("No menu with this Id.", 400));
  }
  res.status(201).json({
    status: 201,
    message: "success",
    data: {
      data: menu,
    },
  });
});
