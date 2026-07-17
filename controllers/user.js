const { model } = require("mongoose");
const user = require("../models/user.js");
const passport = require("passport");

module.exports.signuprender =(req,res)=>{
    res.render("users/signup.ejs")
}




module.exports.signuppost =async(req,res,next)=>{
    try{
          const{username,email,password} = req.body;
    let data =  new user({email,username});
    const registerdUser = await user.register(data,password);
req.login(registerdUser,(err)=>{
    if(err){
        return next(err)
    }
    //isse jaise hi ham signup karenge waisehi login bhi ho jaenge
   console.log(registerdUser);
    req.flash("success", "Signup Successfully!")
    res.redirect("/listing")
})

  
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
    //isse hame usi page per flash message show hoga agr koi error aa gya to like signup successfully
  
}



module.exports.loginrender= (req,res)=>{
    res.render("users/login.ejs");
}


module.exports.loginpost = async(req,res)=>{
    // console.log(req.user);

    
    req.flash("success","Welcome Back to Wonderlust ")
    if(res.locals.redirectUrl){
       
    //ye somefact me gadbari me g1 ka temporary solution hai ise permanent solve kro this is not a good way iske nice wala solution
   let redirectToManual=res.locals.redirectUrl.split("/");
   if(redirectToManual.includes("reviews")){
    return res.redirect(`/listing/${redirectToManual[2]}`)
   }
   else{
     return  res.redirect(res.locals.
     redirectUrl) 
    }
}
   
  res.redirect("/listing")
}
module.exports.logout=(req,res,next)=>{

    //passport have inbuilt login and logout function
req.logout((err)=>{
    if(err){
        return next(err)
    }
    req.flash("success","Logged out Successfully!")
    res.redirect("/listing")
})
}