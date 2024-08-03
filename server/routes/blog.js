const router = require("express").Router();
const blogController = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], blogController.createBlog);
router.get("/", blogController.getBlogs);
router.get("/getOne/:blogId", blogController.getBlog);

router.put("/like-blog/:blogId", [verifyAccessToken], blogController.likeBlog);
router.delete(
  "/:blogId",
  [verifyAccessToken, isAdmin],
  blogController.deleteBlog
);
router.put(
  "/dislike-blog/:blogId",
  [verifyAccessToken],
  blogController.dislikeBlog
);
router.put("/:blogId", [verifyAccessToken, isAdmin], blogController.updateBlog);

module.exports = router;
