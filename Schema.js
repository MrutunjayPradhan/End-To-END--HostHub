const Joi = require("joi");
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.object({
            path:Joi.string().required(),
            filename:Joi.string().required()
        }),
        price:Joi.number().min(0).required(),
        location:Joi.string().required(),
        country:Joi.string(),
        reviews:Joi.array()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required(),
        comment:Joi.string().required(),
    }).required()
})

