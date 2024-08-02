const userRouter = require("./user");
const productRouter = require("./product");
const categoryProductRouter = require("./categoryProduct");
const categoryBlogRouter = require("./blogCategory");
const { notFound, errorHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/category-product", categoryProductRouter);
  app.use("/api/category-blog", categoryBlogRouter);

  // neu khong trung voi url nao thi se chay vao ham notFound
  app.use(notFound);

  // xu ly loi tap trung trong khi ung dung chay
  app.use(errorHandler);
};

module.exports = initRoutes;
