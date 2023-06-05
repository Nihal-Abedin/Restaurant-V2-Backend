const express = require("express");
const ReviewRoutes = require("./reviewRoutes");
const { createMenuForRes } = require("../controllers/restaurantController");
const {
  getAllMenu,
  getMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menuController");
const {
  isAuthenticated,
  allowedRoles,
} = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(isAuthenticated, allowedRoles("admin"), createMenuForRes)
  .get(getAllMenu);

router
  .route("/:menuId")
  .get(getMenu)
  .patch(isAuthenticated, allowedRoles("admin"), updateMenu)
  .delete(isAuthenticated, allowedRoles("admin"), deleteMenu);

router.use("/:menuId/review", ReviewRoutes);

// menu/:menuId/review (POST => create a review of res 123 on menu 123)
// menu/:menuId/review (POST => create a review on menu 123, give the restaurant id to body for referance)

// menu/:menuId/review (GET => get all review for the menu 123)
// review/ (OPTIONAL) (GET => get all review for the menu 123, need to pass the menu Id to body)

// menu/:menuId/review/:reviewId (GET => get all review for the menu 123)
// review/:id (OPTIONAL) (GET => get single review 123, for the menu 123 need to pass the menu Id to body)

// review/:reviewId (UPDATE / DELTE => for a single review)
module.exports = router;
