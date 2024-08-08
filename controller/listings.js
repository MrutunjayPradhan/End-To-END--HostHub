const listing = require("../Models/listing");

module.exports.index = async (req, res) => {
  const allData = await listing.find({});
  res.render("listings/index.ejs", { allData });
};

module.exports.create = (req, res) => {
  res.render("User/create.ejs");
};
module.exports.addListing = async (req, res, next) => {
  // passing the listing object from the user to the server
  let url =req.file.path;
  let filename =req.file.filename;
  console.log(url+".."+filename)
  let sample = new listing(req.body.listing);
  sample.owner = req.user._id;
  sample.image={url,filename}
  await sample.save().then(() => {
    console.log("Sample was saved");
    req.flash("success", "new listing created!!");
  });
  res.redirect("/listings");
};

module.exports.editForm = async (req, res, next) => {
  let { id } = req.params;
  let doc = await listing.findById(id);
  res.render("User/edit.ejs", { doc });
};

module.exports.update = async (req, res, next) => {
  let { id } = req.params;
  // deconstructing the listing inside req.body
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Edited successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res, next) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Deleted successfully");
  res.redirect("/listings");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  
  let value = await listing
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!value) {
    req.flash("fail", "Listing you are requested for is not available !! ");
    res.redirect(`/listings`);
  } else {
    res.render("listings/show.ejs", { value });
  }
};
