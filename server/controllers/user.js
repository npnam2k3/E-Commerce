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
  const response = await User.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response,
  });
});

module.exports = {
  register,
};
