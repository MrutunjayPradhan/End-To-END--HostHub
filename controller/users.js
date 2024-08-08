const USER = require("../Models/user")

module.exports.loginForm=async (req, res) => {
    res.render("User/loginForm");
}

module.exports.loginProcess=async (req, res, next) => {
    // let info = await req.body;
    // console.log(info);
    req.flash("success", "Welcome back !! ")
    console.log(res.locals.url)
    let redirect = res.locals.url || "/listings";
    res.redirect(redirect);
}
module.exports.signupForm = async (req, res) => {
    res.render("User/signUp");
}

module.exports.signupProcess=async (req, res, next) => {
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
}
module.exports.logoutProcess= (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "loggedOut successfully");
        res.redirect("/listings")
    })
}