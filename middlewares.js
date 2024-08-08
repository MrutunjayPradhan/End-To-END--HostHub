const listing = require("./Models/listing");
const reviews = require("./Models/reviews");
const Reviews = require("./Models/reviews")
const {listingSchema,reviewSchema}= require("./Schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLogedIn=(req,res,next)=>{
 if(!req.isAuthenticated()){
   req.session.url = req.originalUrl;
    req.flash("error","You need to login first")
    return res.redirect("/login")
 }
 next();
}

module.exports.saveRedirect=(req,res,next)=>{

   if(req.session.url){
      res.locals.url = req.session.url;
   }
   next();
}

module.exports.isOwner = async(req,res,next)=>{
   let{id} = req.params;
   let value = await  listing.findById(id);
   // console.log(value.owner)
   if(!value.owner.equals(res.locals.curUser._id) ){
       req.flash("error","You don't have permission");
      return  res.redirect(`/listings/${id}`);
   }
   next();
}

module.exports.validateList = (req, res, next) => {
   let { error } = listingSchema.validate(req.body);
   if (error) {
     console.log(error)
     throw new ExpressError(400, error)
   } else {
     next();
   }
 }
 module.exports.validateReview = (req, res, next) => {
   let { error } = reviewSchema.validate(req.body);
   if (error) {
     throw new ExpressError(400, error)
   } else {
     next();
   }
 }
//  module.exports.isReviewAuthor = async(req,res,next)=>{
//    let{id,rid} = req.params;
//    let value = await  Reviews.findById(rid);
//    // console.log(value.owner)
//    if(!value.author.equals(res.locals.curUser._id) ){
//        req.flash("error","You don't have permission");
//       return  res.redirect(`/listings/${id}`);
//    }
//    next();
// }
 module.exports.isReviewAuthor= async(req,res,next)=>{
   let { id, rid } = req.params;
   let val = await Reviews.findById(rid);
   if(!val.author.equals(res.locals.curUser._id)){
      req.flash("error","You don't have permission");
      return  res.redirect(`/listings/${id}`);
   }
   next();
 }