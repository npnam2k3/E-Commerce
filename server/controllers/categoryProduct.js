const CategoryProduct = require("../models/CategoryProduct");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const response = await CategoryProduct.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdCategory: response ? response : "Cannot create new Category",
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const response = await CategoryProduct.find().select("_id title");
  return res.status(200).json({
    success: response ? true : false,
    prodCategories: response ? response : "Cannot get Categories",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const response = await CategoryProduct.findByIdAndUpdate(
    categoryId,
    req.body,
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Cannot update Category",
  });
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const response = await CategoryProduct.findByIdAndDelete(categoryId);
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Cannot delete Category",
  });
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
