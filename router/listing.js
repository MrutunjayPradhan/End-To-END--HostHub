const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const listing = require("../Models/listing");
const {listingSchema}= require("../Schema");

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

//Home Route
router.get("/", wrapAsync(async (req, res) => {
    const allData = await listing.find({});
    res.render("listings/index.ejs", { allData });
}));

//Create Route
router.get("/create", (req, res) => {
    res.render("User/create.ejs");
});

//Add Route
router.post("/", validateList, wrapAsync(async (req, res, next) => {
    // passing the listing object from the user to the server
    let sample = new listing(req.body.listing);
    await sample
        .save()
        .then(() => {
            console.log("Sample was saved")
            req.flash("success","new listing created!!")
        })
    res.redirect("/listings");

}));

//Edit Route
router.get("/edit/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let doc = await listing.findById(id);
    res.render("User/edit.ejs", { doc });
}));

//Update Route
router.patch("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    // deconstructing the listing inside req.body
    await listing
        .findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success","Edited successfully")
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.get("/delete/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Deleted successfully")
    res.redirect("/listings");
}));

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let value = await listing.findById(id).populate("reviews");
    if(!value){
        req.flash("fail","Listing you are requested for is not available !! ")
        res.redirect(`/listings`)
    }else{

        res.render("listings/show.ejs", { value });
    }
}));

module.exports = router;