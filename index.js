const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session= require("express-session");
const flash = require("connect-flash");
//Autherization
const User = require("./Models/user")
const passport = require("passport");
const localStrategy = require("passport-local");


const listings = require("./router/listing");
const reviews = require("./router/review");
const users = require("./router/user");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
 
const sessionOption={
  secret: 'It can be your password',
  resave: false,
  saveUninitialized: true,
  cookie: { 
      expriees: Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true
   }
}
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware to acces flash message 
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.fail=req.flash("error");
  res.locals.curUser=req.user;
  next();
})

//routs
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)
app.use("/",users)

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

const port = 8080;

app.get("/", (req, res) => {
  res.send("This is the root");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
})
//Error Handailing middleware
app.use((err, req, res, next) => {
  // console.log(err);
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { message });
})

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
