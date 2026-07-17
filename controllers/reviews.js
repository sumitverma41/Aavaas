const review = require("../models/review.js");
const schema = require("../models/data.js");


module.exports.newreviewpost = async(req,res)=>{
    let id =req.params.id;
  let list= await schema.findById(id);

  
    
   let nreview = new review(req.body);
   console.log(nreview)
   list.reviews.push(nreview);
 
   nreview.author = req.user._id

   await nreview.save();
   await list.save();
    req.flash("success","New Review Created")
   res.redirect(`/listing/${id}`)
}

module.exports.deletereview =  async(req,res)=>{
    let id = req.params.id;
    let rid = req.params.rid;
    //$pull is method of mongoose which remove all thing that condition apply;
  let del= await schema.findByIdAndUpdate(id,{$pull:{reviews:rid}});
  console.log(del);
await review.findByIdAndDelete(rid);
   req.flash("success","Review Deleted!");
   res.redirect(`/listing/${id}`);
}