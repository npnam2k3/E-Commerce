const router = require("express").Router();
const couponController = require("../controllers/coupon");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], couponController.createCoupon);
router.get("/", couponController.getCoupons);

router.put(
  "/:couponId",
  [verifyAccessToken, isAdmin],
  couponController.updateCoupon
);
router.delete(
  "/:couponId",
  [verifyAccessToken, isAdmin],
  couponController.deleteCoupon
);

module.exports = router;
