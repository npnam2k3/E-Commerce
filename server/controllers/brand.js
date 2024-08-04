const Brand = require("../models/Brand");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) throw new Error("Missing inputs");
  const response = await Brand.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Cannot create new Brand",
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const response = await Brand.findByIdAndUpdate(brandId, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Cannot update brand",
  });
});

const getBrands = asyncHandler(async (req, res) => {
  const response = await Brand.find();
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Cannot get brands",
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const brand = await Brand.findByIdAndDelete(brandId);
  return res.json({
    success: brand ? true : false,
    result: brand || "Something went wrong",
  });
});

module.exports = {
  createBrand,
  updateBrand,
  getBrands,
  deleteBrand,
};
