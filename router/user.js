const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirect } = require("../middlewares");
const {
  loginForm,
  loginProcess,
  signupForm,
  signupProcess,
  logoutProcess,
} = require("../controller/users");

router
  .route("/login")
  .get(loginForm)
  .post(
    saveRedirect,
    passport.authenticate("local", {
      failureRedirect: "/login/",
      failureFlash: true,
    }),
    wrapAsync(loginProcess)
  );

router.route("/signup").get(signupForm).post(wrapAsync(signupProcess));

router.get("/logout", logoutProcess);

module.exports = router;
