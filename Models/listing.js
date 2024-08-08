const mongoose = require("mongoose");
const Review= require("./reviews");
const User =require("./user");
const Schema = mongoose.Schema;

const listingSchema = Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
       url:String,
       filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]   ,
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    } 
})

// middlewares
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length){
        await Review.deleteMany({_id:{$in:listing.reviews}})
        .then(()=>console.log("Deleted All releted reviews"))
    }
        
})

const listing = mongoose.model("listing",listingSchema);

module.exports = listing;