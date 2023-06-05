const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");

dotenv.config();
const { allowOrigins } = require("./utils/allowOrigins");
const GlobalErrorHandeler = require("./controllers/errorController");
const app = express();
const UserRoutes = require("./routes/userRoutes");
const RestaurantRoutes = require("./routes/restaurantRoutes");
const MenuRoutes = require("./routes/menuRoutes");
const ReviewRoutes = require("./routes/reviewRoutes");
const CategoryRoutes = require("./routes/categoryRoutes");

// Global middlewares
console.log(allowOrigins);

// SET CORS
app.use(
  cors({
    origin: allowOrigins,
  })
);
// set some validation to our app headers
app.use(helmet());

app.use(express.json());

// Data Sanitization on req.body & req.params for filterout any query input
app.use(mongoSanitize());

// Clean any user input ant HTML/JS mallicious code
app.use(xss());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this ID, try again in an hour!",
});

app.use("/api", limiter);

//routes
app.use(`/api/v${process.env.VERSION}/user`, UserRoutes);
app.use(`/api/v${process.env.VERSION}/restaurant`, RestaurantRoutes);
app.use(`/api/v${process.env.VERSION}/menu`, MenuRoutes);
app.use(`/api/v${process.env.VERSION}/review`, ReviewRoutes);
app.use(`/api/v${process.env.VERSION}/category`, CategoryRoutes);

app.use(GlobalErrorHandeler);

module.exports = app;
