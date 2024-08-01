const router = require("express").Router();
const productController = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], productController.createProduct);
router.get("/", productController.getAllProduct);
router.put("/ratings", verifyAccessToken, productController.ratings);

router.put(
  "/:productId",
  [verifyAccessToken, isAdmin],
  productController.updateProduct
);
router.delete(
  "/:productId",
  [verifyAccessToken, isAdmin],
  productController.deleteProduct
);

// có params thì để cuối cùng tránh bị nhầm giữa các route
router.get("/:productId", productController.getProduct);

module.exports = router;
