const schema = require("../models/data.js")
const exer = require("../util/expresser.js");
const review = require("../models/review.js")
const {listingSchema}=require("../schema.js")



module.exports.isLoggedin= (req,res,next)=>{
    console.log(req.user);
    //ye req.user ek predfine function hai passport ka jo ki user ka details print krata hai jaise loggin krke ek nyi list bnao pta chal jaega console me
    
       if(!req.isAuthenticated()){
        //ye krne se , passport ki madad se phle dekha jaega ki user session me logged in hai ya nhi 
        // console.log(req);
        //req ke andar ek path and originalUrl hota hai jo ki us path ko store krta hai jispe hamne click kiya hai either ki wo link chale ya nhi isme path store ho jaata hai  ex- "/blabla" similarly originalUrl ke andar uska pura link aa jata hai jaise ex "/listing/blabla"
        req.session.redirectUrl=req.originalUrl
        //yha redirectUrl ke andar hmara originalUrl ka link store ho jaega jis bhi link to dbaenge
        // uses-  jaise let i am not login and i am trying to addd new listing the when i click on the add new listing then it will redirect to my login page but also it will store the link of add new listing inside the redirectUrl that i created inside the session . and then we can directly redirct to that add new listing form just after login the user
        //and because it is inside the session so i can use it anywhere 
        req.flash("error","User is not Logged in")
       return res.redirect("/login")
       //return karana jaruri hai kyoki nhi karaenge to 2 2 responce chala jaega niche wala bhi
    }
    next()
}


module.exports.saveRedirectUrl = (req,res,next)=>{
//iski jarurat pari kyoki jaise hi ham successfully login kar lete to hmara authentication pura ho jata haur then uske baad passport hmara req.session.redirectUrl empty kra deta kyoki uper wala hmara authentication pura ho jata isiliye ham ise locals me save kra lenge
if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
}
next();
}


module.exports.isOwner = async(req,res,next)=>{
    const {id} = req.params;
   const list= await schema.findById(id);
if(!list.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","user have not permission to edit or delete")
    return res.redirect( `/listing/${id}`)
}
next()
}


module.exports.canEditReview = async(req,res,next)=>{
    const {id,rid}  = req.params
    const reviews = await review.findById(rid);

    if(reviews.author &&!reviews.author.equals(res.locals.currUser._id)){
        req.flash("error","user have not permission to delete/edit it")
        return res.redirect(`/listing/${id}`);
    }
    next()
}

// //backend(joi)ka error hadler middleware
module.exports.validatelist=(req,res,next)=>{
   let {error} = listingSchema.validate(req.body); 
    if(error){
        //yha async await ka use nhi hua hai islilye yha default error class ko next ke aandar nhi ,direct throw kiya gya hai yhi per. ye throw karega aur wraphandle ka error handler catch karega ye error ko 
        req.flash("error",error.message)
        res.redirect("/listing")
        // throw new exer(400,error.message);
    }
    else{

        next();   
    }
}
