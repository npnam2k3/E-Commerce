const Coupon = require("../models/Coupon");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expire } = req.body;
  if (!name || !discount || !expire) throw new Error("Missing inputs");
  const response = await Coupon.create({
    ...req.body,
    expire: Date.now() + +expire * 24 * 60 * 60 * 1000,
  });
  return res.json({
    success: response ? true : false,
    data: response ? response : "Cannot create coupon",
  });
});

const getCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("-createdAt -updatedAt");
  return res.json({
    success: response ? true : false,
    data: response ? response : "Cannot get coupons",
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body.expire)
    req.body.expire = Date.now() + +req.body.expire * 24 * 60 * 60 * 1000;
  const response = await Coupon.findByIdAndUpdate(couponId, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    data: response ? response : "Cannot update coupon",
  });
});
const deleteCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;
  const response = await Coupon.findByIdAndDelete(couponId);
  return res.json({
    success: response ? true : false,
    data: response ? response : "Cannot delete coupons",
  });
});

module.exports = {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
};
