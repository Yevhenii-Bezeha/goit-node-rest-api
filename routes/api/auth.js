const express = require("express");

const authController = require("../../controllers/auth");
const { validateBody } = require("../../decorators");
const { usersSchemas } = require("../../validators");
const { authorization, upload } = require("../../middlewares");

const router = express.Router();

router.post(
  "/register",
  validateBody(usersSchemas.registerUser),
  authController.register
);
router.post(
  "/login",
  validateBody(usersSchemas.loginUser),
  authController.login
);

router.get("/current", authorization, authController.current);
router.post("/logout", authorization, authController.logout);
router.post(
  "/verify",
  validateBody(usersSchemas.loginUser),
  authController.resend
);
router.get("/verify/:verificationToken", authController.verify);

router.patch(
  "/avatars",
  upload.single("avatar"),
  authorization,
  authController.updateAvatar
);

module.exports = router;
