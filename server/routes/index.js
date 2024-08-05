const userRouter = require("./user");
const productRouter = require("./product");
const categoryProductRouter = require("./categoryProduct");
const categoryBlogRouter = require("./blogCategory");
const blogRouter = require("./blog");
const brandRouter = require("./brand");
const couponRouter = require("./coupon");
const orderRouter = require("./order");
const insertRouter = require("./insert");
const { notFound, errorHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/category-product", categoryProductRouter);
  app.use("/api/category-blog", categoryBlogRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/brand", brandRouter);
  app.use("/api/coupon", couponRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/insertData", insertRouter);

  // neu khong trung voi url nao thi se chay vao ham notFound
  app.use(notFound);

  // xu ly loi tap trung trong khi ung dung chay
  app.use(errorHandler);
};

module.exports = initRoutes;
