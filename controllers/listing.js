const schema = require("../models/data.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
//user jo 3 variable hai uske madad se ham geocoding kr rhe hai ye basically mapbox ka ek SDK-software development kit hai.



module.exports.index=async(req,res)=>{
    const data =await schema.find({});
    // console.log(data);
    let a =0;
    res.render("home.ejs",{data,a})
}


module.exports.showlist = async(req,res)=>{
    const id = req.params.id;

    const data= await schema.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        },   //review ko populatekarae to uska sara details aa gya per uske andar jo owner ka id hai ham chate hai ki uski bhi sari datails aa jae and then ham apne review wale card par uska details show kar pae to ye isi tarah hoga
    }).populate("owner")








if(!data){
        req.flash("error","Listing not Found!")
       return res.redirect("/listing")
    }
    res.render("show.ejs",{data});
}

module.exports.newlist=(req, res) => {
 //here isLoggedin middleware will execute first for authentication that user is logged in or not
    res.render("new.ejs");
}


module.exports.newlistpost=async(req,res,next)=>{
    //yha phle validatelist chalega as a middleware
    
//   if(!req.body.title || !req.body.description || !req.body.url || !req.body.price || !req.body.location || !req.body.country){
//         return next(new exer(400,"All fields are required!")); 
// can also do this rather than using validatelist middleware     
//   }
const data=req.body;
   const {path,filename}=req.file;

    console.log(data);



 let response = await geocodingClient.forwardGeocode({
  query: data.location,
  limit: 1
})
  .send()
  
  console.log(response.body.features[0].geometry);
  const coordinate=response.body.features[0].geometry

  




        const newData = new schema({

            title:data.title,
            description:data.description,
            image:{
                url:path,
                filename:filename
            },
            // note jaise joi me define kiya gya hai same to same wiase hi yha extract krna hoga othrwise error milega
            // image:data.image,
            price:data.price,
            location:data.location,
            country:data.country,
            owner:req.user._id,
            // ye req.user ek predfine function hai passport ka jo ki user ka details print krata hai jaise loggin krke ek nyi list bnao pta chal jaega console me
            // Haan, req.user Passport.js me ek predefined property hoti hai — lekin ye tab milti hai jab user authenticate ho chuka ho.
            // Jab koi user login karta hai, aur session active hai, tab Passport req.user me uska data bhar deta hai.
            geometry:coordinate
        })

        await newData.save();
        console.log(newData);
        
        req.flash("success","New Listing Created!")
        // flash message will generated after new listing created
        res.redirect("/listing");
            
  
}

module.exports.updatelist=async(req,res)=>{
    
    const id = req.params.id;
    const data = await schema.findById(id);
    console.log(data);
    if(!data){
        req.flash("error","Listing not Found!")
        return res.redirect("/listing");    
    }
    let originalimg= data.image.url;
    originalimg=originalimg.replace("/upload","/upload/h_300,w_250")
    //ye cloudinary ka intarnal api hai 
    //yha ham image ka link nikal kar usme quality ghata de rhe hai aur yhi tareeka hai ki url me change kar de
    console.log(originalimg);
    
    res.render("update.ejs",{data,originalimg});

}

module.exports.updatelistpost=async(req,res)=>{
const id = req.params.id;
// note ham ye jo kv kv const {id} iska use krte hai to iska use ye hai ki jab kisi object se ek specific chiz nikalna hai jaise yha per id to ham sidha const {id} =req.params likhenge to params me se id aa jaega sidha. aise hamne upre sidha const id = req.params.id likha hai wo bhi thik hai
const newdata=req.body;
console.log(newdata);
if(typeof req.file!=="undefined"){
//means ki agar ham edit ke samay image change nhi kiye to ye req.file undefine dega 

    const url=req.file.path;
    const filename=req.file.filename;
    newdata.image={url,filename}
}
 await schema.findByIdAndUpdate(id,newdata,{new:true,runValidators:true})
  req.flash("success","Listing Updated")
res.redirect(`/listing/${id}`);

}

module.exports.deletelist=async(req,res)=>{
    let id  = req.params.id;
    await schema.findByIdAndDelete(id);
     req.flash("deletion","Listing Deleted")
    //  console.log(req.flash("deletion"));
     
    res.redirect("/listing");
}
