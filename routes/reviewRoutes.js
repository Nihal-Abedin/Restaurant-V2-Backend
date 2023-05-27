const express = require("express");
const {
  createReviewForMenu,
  setUserBody,
} = require("../controllers/menuController");
const {
  isAuthenticated,
  allowedRoles,
} = require("../controllers/authController");
const {
  getReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(isAuthenticated, allowedRoles("user"), createReviewForMenu);

router
  .route("/:revId")
  .get(getReview)
  .patch(isAuthenticated, allowedRoles("user"), updateReview)
  .delete(deleteReview);

module.exports = router;
