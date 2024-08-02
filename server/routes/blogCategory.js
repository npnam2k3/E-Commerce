const router = require("express").Router();
const categoryController = require("../controllers/blogCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyAccessToken, isAdmin, categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.put(
  "/:categoryId",
  verifyAccessToken,
  isAdmin,
  categoryController.updateCategory
);
router.delete(
  "/:categoryId",
  verifyAccessToken,
  isAdmin,
  categoryController.deleteCategory
);

module.exports = router;
