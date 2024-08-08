const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLogedIn, isOwner, validateList } = require("../middlewares");
const {
  index,
  create,
  addListing,
  editForm,
  update,
  deleteListing,
  show,
} = require("../controller/listings");
const multer = require("multer");
const {storage}=require("../cloudConfig")
const upload = multer({storage})

router
  .route("/")
  //Home Route
  .get(wrapAsync(index))
  //Add Route
  .post(isLogedIn,upload.single('listing[image]'),validateList, wrapAsync(addListing));
//Create Route
router.get("/create",isLogedIn, create);

router
  .route("/:id")
  //Update Route
  .patch(isLogedIn, isOwner, wrapAsync(update))
  //Show Route
  .get(wrapAsync(show));

//Edit Route
router.get("/edit/:id", isLogedIn, isOwner, wrapAsync(editForm));

//Delete Route
router.get("/delete/:id", isLogedIn, isOwner, wrapAsync(deleteListing));

module.exports = router;
