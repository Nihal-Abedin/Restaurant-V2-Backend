const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateValues = (err) => {
  console.log(err);
  const message = `Tour with this ${Object.keys(
    err.keyValue
  )} : ${Object.values(err.keyValue)} already exists`;
  console.log(message);
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  let messageArray = [];
  for (let i in err.errors) {
    messageArray.push({
      [i]: err.errors[i].message,
    });
    // console.log(i);
  }
  console.log(messageArray);
  return new AppError("Invalid input", 400, messageArray);
  //   console.log(Object.values(err.errors));
};

const sendResDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // console.log(err);
  if (process.env.NODE_ENV === "development") {
    sendResDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateValues(error);
    if (error.name === "ValidationError") error = handleValidationError(error);

    sendErrorProd(error, res);
  }
};
