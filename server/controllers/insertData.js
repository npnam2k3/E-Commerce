const Product = require("../models/Product");
const Category = require("../models/CategoryProduct");
const asyncHandler = require("express-async-handler");
const data = require("../../data/data.json");
const cateData = require("../../data/cate_brand");
const slugify = require("slugify");

const fn = async (product) => {
  await Product.create({
    title: product?.name,
    slug: slugify(product?.name) + Math.round(Math.random() * 100) + "",
    description: product?.description,
    branch: product?.brand,
    price: Math.round(Number(product?.price.match(/\d/g).join("")) / 100),
    category: product?.category[1],
    quantity: Math.round(Math.random() * 1000),
    sold: Math.round(Math.random() * 100),
    images: product?.images,
    color: product?.variants?.find((e) => e.lable === "Color")?.variants[0],
  });
};
const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];
  for (let product of data) {
    promises.push(fn(product));
  }
  await Promise.all(promises);
  return res.json("Done");
});

const fn2 = async (cate) => {
  await Category.create({
    title: cate?.cate,
    branch: cate?.brand,
  });
};
const insertCate = asyncHandler(async (req, res) => {
  const promises = [];
  for (let cate of cateData) {
    promises.push(fn2(cate));
  }
  await Promise.all(promises);
  return res.json("Done");
});

module.exports = {
  insertProduct,
  insertCate,
};
