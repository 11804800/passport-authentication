const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String
    }
},{
    timeStamps:true
});

//attaching the user model with the passport local mongoose  for users data
userSchema.plugin(passportLocalMongoose);
//exporting the data
module.exports=mongoose.model("users",userSchema);

