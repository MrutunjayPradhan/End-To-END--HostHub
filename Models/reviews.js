const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user")

const reviewSchema = new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    comment:{
        type:String
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created_At:{
        type:Date,
        default: Date.now()
    }
})

module.exports= mongoose.model("Review",reviewSchema);

