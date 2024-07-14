const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        set:(v)=>v==="" ? "https://unsplash.com/photos/white-house-under-maple-trees-1ddol8rgUH8":v,
        default:"https://unsplash.com/photos/white-house-under-maple-trees-1ddol8rgUH8"
    },
    price:Number,
    location:String,
    country:String    
})

const listing = mongoose.model("listing",listingSchema);

module.exports = listing;