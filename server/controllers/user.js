const User = require("../models/Users");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const crypto = require("crypto");

const sendMail = require("../utils/sendMail");
const { use } = require("../routes/user");

const register = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !lastName || !firstName) {
    return res.status(400).json({
      success: false,
      message: "Missing inputs",
    });
  }
  const user = await User.findOne({
    email,
  });
  if (user) {
    throw new Error("User has exists");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      message: newUser
        ? "Register is successfully"
        : "Have an error while create",
    });
  }
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing inputs",
    });
  }
  const response = await User.findOne({
    email,
  });

  if (response && (await response.isCorrectPassword(password))) {
    // login thanh cong
    // vì response trả về không phải là 1 Object thuần mà là Instance của mongoose nên phải convert sang Object để lấy các thuộc tính
    const { password, role, refreshToken, ...userData } = response.toObject();
    const accessToken = generateAccessToken(userData._id, role);
    const newRefreshToken = generateRefreshToken(userData._id);

    // Lưu refreshToken vào database
    await User.findByIdAndUpdate(
      userData._id,
      { newRefreshToken },
      { new: true }
    ); // new: true => tra ve data sau khi update

    // Lưu refreshToken vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      userData,
      accessToken,
    });
  } else {
    throw new Error("Invalid email or password");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-password -refreshToken -role");
  return res.status(200).json({
    success: user ? true : false,
    result: user ? user : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log("cookie: ", cookie);
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookie");

  // check xem token co hop le hay khong
  // nếu có lỗi sẽ dừng luôn và không chạy các lệnh bên dưới
  const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);

  // nếu không có lỗi (refresh token hop le)
  // check xem token co khop voi token da luu trong db hay khong
  const response = await User.findOne({
    _id: result._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token invalid",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookie");
  // xoa refresh token o db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );

  // xoa refresh token o cookie trinh duyet
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

// reset password
// client gui email => server check email co hop le hay khong => gui email + kem theo link (password change token)
// client check email => click link
// client gui api kem theo token
// check token có giống với token mà server gửi mail hay không
// change password

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangeToken();
  await user.save();

  const html = `Vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
  };
  const result = await sendMail(data);
  return res.status(200).json({
    success: true,
    result,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExp: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExp = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    message: user ? "Updated password" : "Something was wrong",
  });
});

const getAllUser = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    data: response,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Id user invalid");

  // response trả về là user đã bị xóa
  const response = await User.findByIdAndDelete({ _id });
  // console.log(response);
  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response
      ? `User has email ${response.email} deleted`
      : "Cannot delete this user",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Cannot update",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  console.log(response);
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Cannot update",
  });
});

const updateAddressUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    {
      new: true,
    }
  ).select("-password -role -refreshToken");
  console.log(response);
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Cannot update address",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId, quantity, color } = req.body;
  if (!productId || !quantity || !color) throw new Error("Missing inputs");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart.find(
    (element) => element.product.toString() === productId
  );
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Cannot update cart",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        { $push: { cart: { product: productId, quantity, color } } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Cannot update cart",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: productId, quantity, color } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      data: response ? response : "Cannot update cart",
    });
  }
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getAllUser,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateAddressUser,
  updateCart,
};
