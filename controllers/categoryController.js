const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const Category = require("../models/categoryModel");
const Item = require("../models/itemModel");

exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    status: 201,
    message: "succes",
    data: {
      category,
    },
  });
});

exports.createItemOnCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.catId);

  if (!category) {
    return next(new AppError("No category with this Id.", 400));
  }
  req.body.category = req.params.catId;
  const item = await Item.create(req.body);

  res.status(201).json({
    status: 201,
    message: "success",
    data: {
      item,
    },
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.catId).populate({
    path: "items",
    select: "name -category",
  });

  if (!category) {
    return next(new AppError("No category with this Id.", 400));
  }
  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      category,
    },
  });
});

exports.getAllCategory = catchAsync(async (req, res, next) => {
  const catagories = await Category.find();

  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      catagories,
    },
  });
});

exports.updateCategoryName = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.catId,
    req.body,
    { new: true, runValidators: true }
  );

  if (!category) {
    return next(new AppError("No category with this Id.", 400));
  }

  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      category,
    },
  });
});
