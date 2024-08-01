const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../Models/reviews");
const listing = require("../Models/listing");
const {validateReview,isLogedIn, isReviewAuthor } =require("../middlewares")

//post
router.post("/", validateReview,isLogedIn, wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let review1 = new Review({...req.body.review});
  review1.author = req.user._id;
  console.log(review1)
  await review1.save().then(() => console.log("Created Review "))
  let data = await listing.findById(id);
  data.reviews.push(review1);
  await data.save().then(() => console.log("Added to the model"))
  req.flash("success", "New Review Added")
  res.redirect(`/listings/${id}`)
}))

//delete review 
router.delete("/:rid",isLogedIn,isReviewAuthor, wrapAsync(async (req, res, next) => {
  let { id, rid } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: rid } })
  await Review.findByIdAndDelete(rid);
  req.flash("success","Review Deleted")
  res.redirect(`/listings/${id}`)
}))

module.exports = router;