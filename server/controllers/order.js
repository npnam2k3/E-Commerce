const Order = require("../models/Order");
const User = require("../models/Users");
const Coupon = require("../models/Coupon");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;

  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.product", "title price");

  const products = userCart?.cart?.map((ele) => ({
    product: ele.product._id,
    count: ele.quantity,
    color: ele.color,
  }));
  let total = userCart?.cart?.reduce(
    (sum, ele) => ele.product.price * ele.quantity + sum,
    0
  );
  const createData = { products, total, orderBy: _id };
  if (coupon) {
    const selectedCoupon = await Coupon.findById(coupon);
    total =
      Math.round((total * (1 - +selectedCoupon.discount / 100)) / 1000) *
        1000 || total;
    createData.total = total;
    createData.coupon = coupon;
  }
  const result = await Order.create(createData);
  return res.json({
    success: result ? true : false,
    data: result ? result : "Something went wrong",
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing status");
  const response = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
  return res.json({
    success: response ? true : false,
    data: response ? response : "Something went wrong",
  });
});

const getUserOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await Order.find({ orderBy: _id });
  return res.json({
    success: response ? true : false,
    data: response ? response : "Something went wrong",
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const response = await Order.find();
  return res.json({
    success: response ? true : false,
    data: response ? response : "Something went wrong",
  });
});

module.exports = {
  createOrder,
  updateStatus,
  getUserOrder,
  getOrders,
};
