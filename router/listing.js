const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listing = require("../Models/listing");
const { isLogedIn, isOwner, validateList } = require("../middlewares");

//Home Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allData = await listing.find({});
    res.render("listings/index.ejs", { allData });
  })
);

//Create Route
router.get("/create", isLogedIn, (req, res) => {
  res.render("User/create.ejs");
});

//Add Route
router.post(
  "/",
  validateList,
  wrapAsync(async (req, res, next) => {
    // passing the listing object from the user to the server
    let sample = new listing(req.body.listing);
    sample.owner = req.user._id;
    await sample.save().then(() => {
      console.log("Sample was saved");
      req.flash("success", "new listing created!!");
    });
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/edit/:id",
  isLogedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let doc = await listing.findById(id);
    res.render("User/edit.ejs", { doc });
  })
);

//Update Route
router.patch(
  "/:id",
  isLogedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    // deconstructing the listing inside req.body
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Edited successfully");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.get(
  "/delete/:id",
  isLogedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully");
    res.redirect("/listings");
  })
);

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let value = await listing
      .findById(id)
      .populate({ path: "reviews", 
        populate: { path: "author" }, })
      .populate("owner");
      console.log(value);
    if (!value) {
      req.flash("fail", "Listing you are requested for is not available !! ");
      res.redirect(`/listings`);
    } else {
      res.render("listings/show.ejs", { value });
    }
  })
);

module.exports = router;
