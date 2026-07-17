// FOR SERVER SIDE VALIDATION
//it is required because we can still send wrong data by the help of like postman,hopscotch etc therefore serverside validation is also required.

const joi = require("joi");


module.exports.listingSchema =joi.object({

    title:joi.string().required(),
    description:joi.string().required(),
    image:joi.object({
        filename:joi.string(),
        url:joi.string().allow("",null), 
    }),
    price:joi.number().required().min(0),
    location:joi.string().required(),
    country:joi.string().required(),


})
module.exports.reviewSchema = joi.object({
  
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()
 
})