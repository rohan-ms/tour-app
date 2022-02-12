const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
name:String,
email:String,
password:String,
role:String,
photo:String,
active:Boolean
})

const User=mongoose.model('User',userSchema)

module.exports=User