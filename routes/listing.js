const express = require("express");
const data = require("../models/sample.js")
const router = express.Router();
const wraphandle = require("../util/wrapasync.js");
//  . ka mtlb usi directory(folder me) and .. ka mtlb parent directory me mtlb folder jis folder me hai
const schema = require("../models/data.js");

const {isLoggedin,isOwner,validatelist}=require("./middleware.js")
//isOwner wale middleware se agar koi user postman wegera se bhi edit ya delete krne ki kosis karega listing ko withot login then wo nhi kar paega

const listingController = require("../controllers/listing.js")
const multer = require("multer");
const {storage,cloudinary}=require("../CloudConfig.js")
const upload  = multer({storage})
//multer ka use file ko parse krne ke liye kiya jaata hai jis form me enctype="multipart/form-data" hota hai sirf use hi parse krta ai ye
// phle ise install krna hota hai by npm i multer


const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });




// same path me agar request jaa rha hai to use aur compact form me likh sakte hai router.route ke andar

// aise alag alag bhi thik hai jaise router.get and post ko alag alag ,koi dikkkat nhi hai



router.get("/redefine",async(req,res)=>{
    await schema.deleteMany({});
  let newdata =   data.data.map((obj)=>
    ( {...obj,owner:"68540341827e929f649e05e2"})
)
 let list= await schema.insertMany(newdata);


 

for(let dat of data.data){

    console.log(dat.location);
    
    let response = await geocodingClient.forwardGeocode({
   query: dat.location,
   limit: 1
 })
   .send()
   
   console.log(response.body.features[0].geometry);
   const cordinate=response.body.features[0].geometry
  await schema.findOneAndUpdate({location:dat.location},{$set:{geometry:cordinate}}).then(update=>{ console.log(`updated`)}
  ).catch(err=>{
    console.log(`error`);
    
  })
  }



//  console.log(newdata);
  
    res.send("indx");

    


})






router.route("/")
.get(wraphandle(listingController.index)
)
.post(isLoggedin,upload.single("image[url]"),validatelist,wraphandle(listingController.newlistpost)
);

// upload.single("image[url]")isse hmara jo file upload hua hai jo backend me parse ho jaega aur save ho jaega jo folder ka naam ham diye hai jaise yha phle"uploads/" diye the multer me isiliye is project me uploads ka bhi folder hai jisme ek image ka data bhi save hai lekin ab ham isko cloudinary ke clode ke storage me save kra rhe hai





router.route("/:id")
.get(wraphandle(listingController.showlist)
)
.delete(isLoggedin,isOwner,wraphandle(listingController.deletelist)
)




router.get("/data/new",isLoggedin,listingController.newlist)


router.route("/:id/update")
.get(isLoggedin,isOwner,wraphandle(listingController.updatelist))
.put(isLoggedin,isOwner,upload.single("image[url]"),validatelist,wraphandle(listingController.updatelistpost))



module.exports =router;