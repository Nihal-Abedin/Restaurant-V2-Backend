const express = require("express");
const {
  signUp,
  login,
  isAuthenticated,
  allowedRoles,
} = require("../controllers/authController");
const {
  getAllUsers,
  getUser,
  updateMe,
  deleteMe,
} = require("../controllers/userController");
const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);

router.route("/").get(isAuthenticated, allowedRoles("admin"), getAllUsers);
router.use(isAuthenticated);
router.route("/:id").get(getUser).patch(updateMe).delete(deleteMe);

module.exports = router;
