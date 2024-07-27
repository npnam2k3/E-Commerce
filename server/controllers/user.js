const User = require("../models/Users");
const asyncHandler = require("express-async-handler");

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
    return res.status(200).json({
      success: true,
      userData,
    });
  } else {
    throw new Error("Invalid email or password");
  }
});

module.exports = {
  register,
  login,
};
