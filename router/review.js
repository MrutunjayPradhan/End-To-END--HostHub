const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../Models/reviews");
const listing = require("../Models/listing");
const { reviewSchema } = require("../Schema");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next();
  }
}

//Reviews route 
//post
router.post("/", validateReview, wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let review1 = new Review(req.body.review);
  await review1.save().then(() => console.log("Created Review "))
  let data = await listing.findById(id);
  data.reviews.push(review1);
  await data.save().then(() => console.log("Added to the model"))
  req.flash("success", "New Review Added")
  res.redirect(`/listings/${id}`)
}))

//delete review 
router.delete("/:rid", wrapAsync(async (req, res, next) => {
  let { id, rid } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: rid } })
  await Review.findByIdAndDelete(rid);
  req.flash("fail","Review Deleted")
  res.redirect(`/listings/${id}`)
}))

module.exports = router;