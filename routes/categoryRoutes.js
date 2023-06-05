const express = require("express");
const {
  createCategory,
  createItemOnCategory,
  getCategory,
  getAllCategory,
  updateCategoryName,
} = require("../controllers/categoryController");
const router = express.Router();

router.route("/").get(getAllCategory).post(createCategory);
router
  .route("/:catId")
  .get(getCategory)
  .post(createItemOnCategory)
  .patch(updateCategoryName)
  .delete(() => {
    // Delete category
  });
module.exports = router;
