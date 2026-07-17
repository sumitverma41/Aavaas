const express = require("express")
const router = express.Router({mergeParams:true});
const passport = require("passport");
const wrapSync = require("../util/wrapasync");

const { saveRedirectUrl } = require("./middleware.js");
const usercontroller = require("../controllers/user.js");






router.get("/signup",usercontroller.signuprender)

router.post("/signup", wrapSync(usercontroller.signuppost))



router.get("/login",usercontroller.loginrender)





router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    //yha local ka matlab hai ki ye locally database se authenticate karega naa ki googe yha other website se
     failureFlash:true,
     //passport me already authenticate ka method rhtah ai hame khud se define krne ki jarurat nhi hai
     //aur agar authentication fail ho jaega to ye whi login me redirect ho jaega fash message ke sath
     //jsie hi loggin krte hai saveRedirectUrl middle ware chalta hai aur user ka data isme save ho jata hai
}),usercontroller.loginpost)

router.get("/logout",usercontroller.logout)


module.exports = router