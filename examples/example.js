const express= require("express");
const app = express();
const port = 4000;
const path = require("path")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));

const cookieParser = require("cookie-parser");
app.use(cookieParser("secret"));

app.get("/cookie",(req,res)=>{
    res.cookie("name","sumit")
       res.send("Cookie received");
})

app.get("/getcookie",(req,res)=>{
   console.log(req.cookies);
//    but first we have to install cookie-parser
    res.send("Cookie received");
 
})
//got to inspect of browser/application/cookie and there you can see your cookie
// one problem is that you can also modify cookie there 
// therefore we use signed cookies
app.get("/signedcookie",(req,res)=>{
    // but to use it we have to write a secret key in cookie-parser
    // like   app.use(cookieParser("someSecretKey"))
    res.cookie("name","amit",{signed:true})
    res.send("Signed Cookie received");
})
app.get("/getsignedcookie",(req,res)=>{
    console.log(req.signedCookies);

    res.send("Signed Cookie received");
})
// now if we modify the cookie from browser then either it will not shw in console or it willshow false
// this is because we have signed the cookie and it is not matching with the signature


app.get("/",(req,res)=>{
    res.send("Hello, World!");
});


app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});


// STATELESS PROTOCOL ==> http is a stateless protocol becouse it does'nt remember the previous request example is that if you login to a website and then refresh the page then it will not remember that you are logged in or not

// STATEFUL PROTOCOL==> it remember the previous request example is that if you login to a website and then refresh the page then it will remember that you are logged in or not . example is cookies and sessions.


         //SESSION

// first we have to install express-session

const session = require("express-session");
app.use(
    session({
        secret:"secret_code_sumit",
        resave:false,
        saveUninitialized:true
    })
);

app.get("/session",(req,res)=>{
    req.session.name = "sumit";
    res.send("Session created");
})
app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count=1;
    }
    res.send(`You have visited this page ${req.session.count} times`);
    // now we can see the session count in the browser
    // and if we refresh the page then it will increment the count
    // but in differesnt browswe it will start from initial value
    // and if we close the browser then it will reset the count
})







      //CONNECT-FLASH
//  first install it
// USE ONLY WHEN WE ARE USINg Session
// it is use for to geberate a popup message only one tife and when we refresh page for second time then message diappear
const flash  = require("connect-flash");
app.use(flash());




app.get("/register",(req,res)=>{
    let {name ="user"} = req.query;
    req.session.name = name;
    console.log(name)
    if(name=="user"){
       req.flash("error","user registerd unsuccessful!"); 
    }
    else{
           req.flash("success","user registerd successfully!"); 
    }

    
    //here success is key and that message is value
    res.redirect("/hello");
    // try this
    // http://localhost:4000/register?name=sumit
    // and then http://localhost:4000/hello
})

app.get("/hello",(req,res)=>{

    res.locals.msg = req.flash("success")
    res.locals.err = req.flash("error")
    // now we can diretly use msg in ejs template also we can send many messages


    
      res.render("example.ejs",{name:req.session.name})
    //   we are accesing flash msg by their key
    // ye msg ejs me sirf ek hi bar flsh hoga uske baad refresh krne ke baad ye wapas gayab ho jaega
})

