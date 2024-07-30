const Product = require("../models/Product");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create new product",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  return res.status(200).json({
    success: product ? true : false,
    data: product ? product : "Cannot get product",
  });
});

const getAllProduct = asyncHandler(async (req, res) => {
  // Link tham khao
  // https://blog.jeffdevslife.com/p/1-mongodb-query-of-advanced-filtering-sorting-limit-field-and-pagination-with-mongoose/
  // https://blog.jeffdevslife.com/p/2-mongodb-query-of-advanced-filtering-sorting-limit-field-and-pagination-with-mongoose/
  const queries = { ...req.query };

  // tách các trường đặc biệt ra khỏi queries
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.map((item) => delete queries[item]);

  // format lai các operators cho đúng cú pháp của mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchElement) => `$${matchElement}`
  );
  console.log("queryString: ", queryString); // la 1 String
  const formatedQueries = JSON.parse(queryString);
  console.log("formatedQueries: ", formatedQueries); // la 1 object

  // filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  let queryCommand = Product.find(formatedQueries); // Promise dang o trang thai pending

  //sorting
  if (req.query.sort) {
    console.log("Sort: ", req.query.sort);
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Execute query
  // Số lượng sp thỏa mãn điều kiện (counts) !== số lượng sp trả về 1 lần gọi API
  queryCommand
    .exec()
    .then(async (response) => {
      const counts = await Product.find(formatedQueries).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Cannot get products",
        counts,
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct: updatedProduct ? updatedProduct : "Cannot update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(productId);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    deletedProduct: deletedProduct ? deletedProduct : "Cannot delete product",
  });
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};
