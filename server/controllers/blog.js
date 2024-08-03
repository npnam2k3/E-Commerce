const Blog = require("../models/Blog");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Missing inputs");
  const response = await Blog.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Cannot create new Blog",
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const response = await Blog.findByIdAndUpdate(blogId, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Cannot update Blog",
  });
});

const getBlogs = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Cannot get Blog",
  });
});

/**
 * khi người dùng bấm like 1 bài blog:
 * 1. Check xem người đó trước đó có dislike hay không => bỏ dislike
 * 2. Check xem người đó trước đó đã like bài viết này hay chưa => bỏ like / thêm like
 */
const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { blogId } = req.params;
  if (!blogId) throw new Error("Missing inputs");
  const blog = await Blog.findById(blogId);
  const alreadyDisliked = blog?.dislikes.find(
    (element) => element.toString() === _id
  );
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      result: response,
    });
  }
  const alreadyliked = blog?.likes.find(
    (element) => element.toString() === _id
  );
  if (alreadyliked) {
    const response = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      result: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      result: response,
    });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { blogId } = req.params;
  if (!blogId) throw new Error("Missing inputs");
  const blog = await Blog.findById(blogId);
  const alreadyliked = blog?.likes.find(
    (element) => element.toString() === _id
  );
  if (alreadyliked) {
    const response = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      result: response,
    });
  }
  const alreadydisliked = blog?.dislikes.find(
    (element) => element.toString() === _id
  );
  if (alreadydisliked) {
    const response = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      result: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      result: response,
    });
  }
});

const excludeFields = "-refreshToken -password -role -createdAt -updatedAt";
const getBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    blogId,
    { $inc: { numberViews: 1 } },
    { new: true }
  )
    .populate("likes", excludeFields)
    .populate("dislikes", excludeFields);
  return res.json({
    success: blog ? true : false,
    result: blog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findByIdAndDelete(blogId);
  return res.json({
    success: blog ? true : false,
    result: blog || "Something went wrong",
  });
});

module.exports = {
  createBlog,
  updateBlog,
  getBlogs,
  likeBlog,
  dislikeBlog,
  getBlog,
  deleteBlog,
};
