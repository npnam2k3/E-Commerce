const userRouter = require("./user");
const productRouter = require("./product");
const { notFound, errorHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);

  // neu khong trung voi url nao thi se chay vao ham notFound
  app.use(notFound);

  // xu ly loi tap trung trong khi ung dung chay
  app.use(errorHandler);
};

module.exports = initRoutes;
