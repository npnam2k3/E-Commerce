const router = require("express").Router();
const brandController = require("../controllers/brand");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], brandController.createBrand);
router.get("/", brandController.getBrands);
router.put(
  "/:brandId",
  [verifyAccessToken, isAdmin],
  brandController.updateBrand
);
router.delete(
  "/:brandId",
  [verifyAccessToken, isAdmin],
  brandController.deleteBrand
);

module.exports = router;
