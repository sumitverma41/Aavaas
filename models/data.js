const mongoose = require('mongoose');


const Schema = new mongoose.Schema({
   title: {
      type: String,
      // required:true,
      // unique:true
   },
   description: {
      type: String,
      // required:true,
      unique: true
   },
   image: {
      filename:
      {
         type: String,
         default: "listingimage"
      },


      url: {


         type: String,
         set: (v) => v === "" ? "https://www.w3schools.com/howto/img_avatar.png" : v,
         //set ka use isiliye hua kyoki agar ye image undefine ya null rahega tab ye yhi link ka image lga dega


         default: "https://www.w3schools.com/howto/img_avatar.png"
      }
   },

   price: {
      type: Number,
      // required:true
   },
   location: {
      type: String,
      // required:true
   },
   country: {
      type: String,
      // required:true
   },
   reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
   }],
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userdetail"
   },


   //schema ke andar point store krane ka yhi shi tareeka hai jise geoJson khte hai
   geometry: {
      type: {
         type:  String, //Dont't do '{location:{type:String}}'
         enum: ['Point'],//'location.type' must be 'Point'
         required: true
      },

      coordinates:{
         type:[Number],
         required:true
      }
    
   }
})

const review = require("./review.js")

//ye ek mongoose ka middleware hai jo listing ke delete button(findbyidanddelete) press krne se chalega aur jisse hmara uss card ka all reviews database se bhi delete ho jaega in mongodb;
Schema.post("findOneAndDelete", async (schemaid) => {
   if (schemaid) {
      await review.deleteMany({ _id: { $in: schemaid.reviews } });
   }
})

const user = mongoose.model("user", Schema);
module.exports = user;