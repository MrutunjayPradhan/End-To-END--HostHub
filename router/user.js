const express = require("express");
const router = express.Router();
const USER = require("../Models/user")
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirect } = require("../middlewares");


router.get("/login", async (req, res) => {
    res.render("User/loginForm");
})

router.post("/login", saveRedirect, passport.authenticate('local', { failureRedirect: '/login/', failureFlash: true }), wrapAsync(async (req, res, next) => {
    let info = await req.body;
    // console.log(info);
    req.flash("success", "Welcome back !! ")
    console.log(res.locals.url)
    let redirect = res.locals.url || "/listings";
    res.redirect(redirect);
}))


router.get("/signup", async (req, res) => {
    res.render("User/signUp");
});
router.post("/signup", wrapAsync(async (req, res, next) => {
    let { firstName, lastName, email, username, password } = req.body.user;
    let user = new USER({
        firstName, lastName, email, username
    })

    let newUser = await USER.register(user, password);
    req.login(newUser, (err) => {
        if (err) {
            return next(err)
        }

        req.flash("success", "Welcome to HostHub!! ")
        res.redirect("/listings")
    })
}));

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "loggedOut successfully");
        res.redirect("/listings")
    })
})

module.exports = router;
