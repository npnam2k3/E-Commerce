const User = require("../models/Users");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");

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
    const { password, role, ...userData } = response.toObject();
    const accessToken = generateAccessToken(userData._id, role);
    const refreshToken = generateRefreshToken(userData._id);

    // Lưu refreshToken vào database
    await User.findByIdAndUpdate(userData._id, { refreshToken }, { new: true }); // new: true => tra ve data sau khi update

    // Lưu refreshToken vào cookie
    res.cookie("refreshToken", refreshToken, {
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
    success: true,
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
module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
};
