if(process.env.NODE_ENV !="production"){
   require('dotenv').config(); 
}

// ye aacha takrika hai kyoki  ham apna env file sirf development level pe kholenge production/deployment level pe ham is access nhi karenge ya phir dusra tareeka hoga access karne ka
// ham kv bhi kisi ko apna env file nhi denge even ki ise github per bhi upload nhi karenge kyoki isme important credential hote hai

const dburl = process.env.ATLASDB_URL






const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const schema = require("./models/data.js");
const data  = require("./models/sample.js");
const methodOverride = require("method-override");
const exer = require("./util/expresser.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const review = require("./models/review.js");
const ejsMate = require('ejs-mate');
const  listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const session = require("express-session")
const {MongoStore} = require("connect-mongo")
const flash= require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local");

const user = require("./models/user.js");
const { log } = require('console');


// for put the session into mongodb atlas or in online data base
const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.mySECRET
    },
    touchAfter: 24*60*60 // it should be in second here
});


store.on("error",(err)=>{
console.log("error in mongo session ",err);

});




const sessionOption = {
    store:store,
    secret:process.env.mySECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
    expires:Date.now()+1000*60*60*24*3,
    // expire on 3 days
    maxAge:1000*60*60*24*3,
    // 
    httpOnly:true

    }

}





app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize())
//it is a middleware that initialize passport;

app.use(passport.session())
// passport.session() middleware ka use Passport.js ke sath authentication system banate waqt hota hai. Iska kaam user ko login hone ke baad har request me authenticated rakhna hota hai, jab tak user logout na kare.

passport.use(new localStrategy(user.authenticate()));
//authenticate method of model in localStrategy
// and authenticalt() generate a function that used in passport's LocalStrategy

passport.serializeUser(user.serializeUser())
//it serialized user into the session
passport.deserializeUser(user.deserializeUser())




const port =4000;

app.set("view engine","ejs");
app.set( "views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

app.engine('ejs', ejsMate);
//ejs mate se common boilerplate har page pe lag jaata hai
app.use(methodOverride("_method"));

async function main(){
    // ye db url mongodb atlas ka url hai jisse database online ho jaega.
    await mongoose.connect(dburl)
}
main().then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log("error occured")
})





app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.deletion = req.flash("deletion");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user
    // console.log("FLASH SUCCESS:", res.locals.success);
    // console.log("FLASH DELETION:", res.locals.deletion);

    // console.log(req.flash("sucess"));
// to ye ek array print krata hai kisme sare messages hote hai jp jo ham define krte hai

    next();
});




app.get("/demo",async(req,res)=>{
    let fakeUser = new user({
        email:"student.abc.in",
        username:"Amit"
    })
let registerdUser= await user.register(fakeUser,"helloworld")
    //here helloworld is password

    res.send(registerdUser)
})


app.get("/", (req, res) => {
res.render("start.ejs");
});


app.use("/listing",listingRouter)
app.use("/listing",reviewRouter)
app.use("/",userRouter);

//agar ham randomly koi bhi route bheje apne server pe aur wo uper wale route se match na kare to ye niche wala middleware chalega; uper wale route ke liye nhi cahlega  kyoki uper wale me to whi se res chala jaega;

app.all(/.*/,(req,res,next)=>{
    next(new exer(404,"page not Found!"));
})

app.use((err,req,res,next)=>{
    let{statusCode=400,message="error"}= err
    // res.status(statusCode).send(message);
    res.render("error.ejs",{statusCode,message});
})

// app.use((err,req,res,next)=>{
//    res.send("something went wrong")

    
// })


app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
})