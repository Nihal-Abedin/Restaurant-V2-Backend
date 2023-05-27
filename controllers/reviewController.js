const catchAsync = require("../utils/catchAsync");
const Review = require("../models/reviewModel");
const AppError = require("../utils/appError");

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.revId);

  if (!review) {
    return next(new AppError("No Review with this Id.", 400));
  }

  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      data: review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.revId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) {
    return next(new AppError("No Review with this Id.", 400));
  }
  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      data: review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      data: "Seccessfully deleted.",
    },
  });
});
