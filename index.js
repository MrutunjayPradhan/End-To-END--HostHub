const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const listing = require("./Models/listing");
const Review = require("./Models/reviews");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const listingSchema= require("./Schema");
const reviews = require("./Models/reviews");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

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

//middlewares
const validateList = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    console.log(error)
    throw new ExpressError(400, error)
  } else {
    next();
  }
}

// const validateReview = (req,res,next)=>{
//   let{error}=reviewSchema.validate(req.body);
//   if(error){
//     throw new ExpressError(400, error)
//   }else {
//     next();
//   }
// }

//Home Route
app.get("/listings", async (req, res) => {
  const allData = await listing.find({});
  res.render("listings/index.ejs", { allData });
});

//Create Route
app.get("/listings/create", (req, res) => {
  res.render("User/create.ejs");
});

//Add Route
app.post("/listings", validateList, wrapAsync(async (req, res, next) => {
  // console.log(req.body);
  // let { title, description, image, price, location, country } = req.body;
  // let sample = listing({
  //   title,
  //   description,
  //   image,
  //   price,
  //   location,
  //   country,
  // });

  //  let result=listingSchema.validate(req.body);
  //  console.log(result)
  //  if(result.error){
  //   throw new ExpressError(400,result.error)
  //  }
  let sample = new listing(req.body.listing);
  await sample
    .save()
    .then(() => console.log("Sample was saved"))
  res.redirect("/listings");

}));

//Edit Route
app.get("/listings/edit/:id", wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let doc = await listing.findById(id);
  res.render("User/edit.ejs", { doc });
}));

//Update Route
app.patch("/listings/:id", wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  // console.log(req.body);
  // deconstructing the listing inside req.body
  await listing
    .findByIdAndUpdate(id, { ...req.body.listing })
    .then((val) => console.log(val));
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.get("/listings/delete/:id", wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const value = await listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { value });
}));


//Reviews route 
//post
app.post("/listings/:id/reviews",wrapAsync(async(req,res,next)=>{
  let {id} = req.params;
  let review1 = new Review(req.body.review);
  await review1.save().then(()=>console.log("Created Review "))
  let data = await listing.findById(id);
  data.reviews.push(review1);
  await data.save().then(()=>console.log("Added to the model"))
  res.redirect(`/listings/${id}`)
}))

//delete
app.get("/listings/:id/delete/:rid",wrapAsync(async(req,res,next)=>{
  let{id,rid}=req.params;
  await listing.findByIdAndUpdate(id,{$pull:{reviews:rid}})
  await Review.findByIdAndDelete(rid);
  res.redirect(`/listings/${id}`)
}))


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
})
//Error Handailing middleware
app.use((err, req, res, next) => {
  console.log(err);
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { message });
})

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
