const User=require('./../models/userModel')
const catchAsync=require("./../utils/catchAsync")
const mongoose=require("mongoose")
exports.getAllusers=catchAsync( async(req,res)=>{
    const allUsers=await User.find({})
    res.json({
        "status":"success",
        "data":{"users":allUsers}
    })
})
exports.setNewusers=(req,res)=>{
    res.json({
        "status":"success",
        "data":{"users":"New user added"}
    })
}
exports.getuser=catchAsync(async (req,res)=>{
    console.log(req.params.id)
    const id=req.params.id
    const users=await User.findOne({"id":id})
    console.log(users)
    res.json({
        "status":"success",
        "data":{"user":users}
    })
})
exports.updateuser=(req,res)=>{
    
    res.json({
        "status":"success",
        "data":{"user":"user data updated"}
    })
}
exports.deleteuser=(req,res)=>{
    res.json({
        "status":"success",
        "data":null
    })
}

exports.updateMe=(catchAsync(async(req,res,next)=>{
    const fields={...req.body}
    const allowedFields=['name','email'];
    let filteredfields={}
    allowedFields.map((val)=>{
        if(fields[val]){
            return filteredfields[val]=fields[val]}
    })
    console.log(filteredfields,fields)
    console.log(req.user._id)
    await User.findByIdAndUpdate(req.user._id,filteredfields)
    res.json({
        status:"success",
        message:"your details has been updated"
    })
}))

exports.deleteMe=(catchAsync(async(req,res,next)=>{
    console.log(req.user._id)
    await User.findByIdAndUpdate(req.user._id,{"active":false})
    res.json({
        status:"success",
        message:"your profile has been deleted"
    })
}))