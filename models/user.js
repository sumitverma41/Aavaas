const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose") 


const userSchema = new schema({
    email:{
        type: String,
        required:true
    },
   //here we use passport-local-mongoose . it will define already a username nad password field and hashed and salt the password 
})
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("userdetail",userSchema);