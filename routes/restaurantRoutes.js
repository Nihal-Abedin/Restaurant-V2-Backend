const express = require("express");
const router = express.Router();
const MenuRoutes = require("./menuRoutes");
const {
  createRes,
  getAllRes,
  getRes,
  updateRes,
} = require("../controllers/restaurantController");
const {
  isAuthenticated,
  allowedRoles,
} = require("../controllers/authController");

router
  .route("/")
  .post(isAuthenticated, allowedRoles("admin"), createRes)
  .get(getAllRes);

router.route("/:id").get(getRes).patch(updateRes);
router.use("/:id/menu", MenuRoutes);

module.exports = router;
