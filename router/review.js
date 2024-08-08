const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const {validateReview,isLogedIn, isReviewAuthor } =require("../middlewares");
const { add, deleteReview } = require("../controller/reviews");

//post
router.post("/", validateReview,isLogedIn, wrapAsync(add))

//delete review 
router.delete("/:rid",isLogedIn,isReviewAuthor, wrapAsync(deleteReview))

module.exports = router;