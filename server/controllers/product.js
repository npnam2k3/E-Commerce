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
  // console.log("queryString: ", queryString); // la 1 String
  const formatedQueries = JSON.parse(queryString);
  // console.log("formatedQueries: ", formatedQueries); // la 1 object

  // filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  let queryCommand = Product.find(formatedQueries); // Promise dang o trang thai pending

  //sorting
  if (req.query.sort) {
    // console.log("Sort: ", req.query.sort);
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Fields limiting
  if (req.query.fields) {
    // console.log("Fields: ", req.query.fields);
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  // Pagination
  // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
  const page = req.query.page * 1 || 1; // *1 to convert to Number
  const limit = req.query.limit * 1 || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  // Execute query
  // Số lượng sp thỏa mãn điều kiện (counts) !== số lượng sp trả về 1 lần gọi API
  queryCommand
    .exec()
    .then(async (response) => {
      const counts = await Product.find(formatedQueries).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        data: response ? response : "Cannot get products",
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

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, productId } = req.body;
  if (!star || !productId) throw new Error("Missing inputs");
  const ratingProduct = await Product.findById(productId);

  // Kiểm tra xem user này đã đánh giá sản phẩm với id này hay chưa
  const alreadyRating = ratingProduct?.ratings?.find(
    (element) => element.postedBy.toString() === _id
  );
  // console.log("Already ratings: ", alreadyRating);
  if (alreadyRating) {
    // đã đánh giá rồi => update star & comment
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating }, // match voi object alreadyRating tra ve thoa man dieu kien
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment }, // $ -> tuong trung cho object duoc tra ve
      },
      { new: true }
    );
  } else {
    // add star & comment
    await Product.findByIdAndUpdate(
      productId,
      {
        // đối với mảng thì dùng push của mongoose
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
  }

  // sum rating
  const updatedProduct = await Product.findById(productId);
  const ratingCount = updatedProduct.ratings.length;
  const sumRating = updatedProduct.ratings.reduce(
    (sum, element) => sum + element.star,
    0
  );
  updatedProduct.totalRatings = Math.round((sumRating * 10) / ratingCount) / 10;
  updatedProduct.save();
  // console.log("sumRating: ", sumRating);
  return res.status(200).json({
    success: true,
    updatedProduct,
  });
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  ratings,
};
