const express = require("express");

const router = express.Router();
const wraphandle = require("../util/wrapasync.js");
//  . ka mtlb usi directory(folder me) and .. ka mtlb parent directory me mtlb folder jis folder me hai

const {listingSchema,reviewSchema}=require("../schema.js");
const exer = require("../util/expresser.js");
const review = require("../models/review.js");
const {  isLoggedin, canEditReview, } = require("./middleware.js");
const reviewcontroller = require("../controllers/reviews.js");




function validatereview(req,res,next){
    // console.log(req.body);
    let {error}= reviewSchema.validate(req.body);

    console.log(error);
    
    if(error){
        throw new exer(400,error.message);
    }
    next();
}






router.post("/:id/reviews" ,validatereview,isLoggedin,wraphandle(reviewcontroller.newreviewpost))



router.delete("/:id/reviews/:rid" , isLoggedin,canEditReview,wraphandle(reviewcontroller.deletereview))


module.exports =router;