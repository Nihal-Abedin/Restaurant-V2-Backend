const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ active: true });

  res.status(200).json({
    status: 200,
    message: "success",
    total_users: users.length,
    data: {
      data: users,
    },
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user with this Id.", 400));
  }

  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      data: user,
    },
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.role) {
    return next(new AppError("Invalid request with role.", 404));
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone_number: req.body.phone_number,
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError("No user with this Id.", 400));
  }
  res.status(200).json({
    status: 200,
    message: "success",
    data: {
      data: user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { active: false });

  if (!user) {
    return next(new AppError("No user with this Id.", 400));
  }
  res.status(200).json({
    message: "Successfully Deleted!",
  });
});
