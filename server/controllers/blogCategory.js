const CategoryBlog = require("../models/BlogCategory");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const response = await CategoryBlog.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Cannot create new Category",
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const response = await CategoryBlog.find().select("_id title");
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Cannot get Categories",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const response = await CategoryBlog.findByIdAndUpdate(categoryId, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Cannot update Category",
  });
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const response = await CategoryBlog.findByIdAndDelete(categoryId);
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
