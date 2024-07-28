const router = require("express").Router();
const userController = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/current", verifyAccessToken, userController.getCurrent);
router.post("/refreshtoken", userController.refreshAccessToken);
router.get("/logout", userController.logout);
router.get("/forgotpassword", userController.forgotPassword);
router.put("/resetpassword", userController.resetPassword);
router.get(
  "/getAllUser",
  [verifyAccessToken, isAdmin],
  userController.getAllUser
);
router.delete("/", [verifyAccessToken, isAdmin], userController.deleteUser);
router.put("/updateCurrent", verifyAccessToken, userController.updateUser);
router.put(
  "/updateUserByAdmin/:userId",
  [verifyAccessToken, isAdmin],
  userController.updateUserByAdmin
);
module.exports = router;
