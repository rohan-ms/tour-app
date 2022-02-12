const User=require('./../models/userModel')
const catchAsync=require("./../utils/catchAsync")
const jwt=require('jsonwebtoken')
const error=require('../utils/errorHandler')
const bcrypt=require('bcryptjs')
const sendMail=require('./../utils/sendMails')
const crypto=require('crypto')
const cookie=require('cookie')

const sendToken=(catchAsync(async (res,user)=>{
    const  token=await jwtSignin(user)
    res.cookie('jwt',token,{
        expires:new Date(Date.now()+(90*24*60*60*1000)),
        httpOnly:true
//secure:true
        
    })
    res.status(200).json({
        'status':'success',
        token
    })
   

}))

const jwtSignin=  (user)=>{
    return jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY})
}

const jwtVerify=  (token)=>{
    return jwt.verify(token,process.env.JWT_SECRET)
}

const getHashedToken=function(token){
    return crypto.Hash('sha256').update(token).digest('hex')
}

exports.signup=catchAsync(async (req,res)=>{
    console.log("hello")
    const created=await User.create(req.body)
    sendToken(res,created)
})

exports.login=catchAsync( async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
       return next(new error("Please input email and password",400))
    }
    const user=await User.findOne({email})
    if(!user){
        return next(new error("Invalid credentials",400))
    }
    console.log(password,user.password)
    const isPassValid=await user.passwordCompare(password,user.password)
    console.log(isPassValid,user.password)
    if(isPassValid){
        sendToken(res,user)
        
    }else{
      return next(new error('wrong username or password',401));
    }

})

exports.protect=catchAsync(async(req,res,next)=>{
//geting and checking token
let token;
if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token=req.headers.authorization.split(" ")[1]
}
if(!token){
    return next(new error("please Login and try again",401))
}
//token verification
const decoded=await jwtVerify(token);
console.log(decoded)

//checking if user exist after the token
const user=await User.findById(decoded.id)
if(!user){
   return  next(new error("user belongs to this token doesn't exist",400))
}

//checking if password is still same
const passwordChanged=user.changedPass(decoded.iat)
if (passwordChanged){
    return next(new error("Password changed please login again"))
}
req.user=user
next()
})

exports.checkEligible=(...roles)=>{
    return (req,res,next)=>{
        // console.log("rols:"+req.user.role)
        // console.log(roles)
        if(roles.includes(req.user.role)){
            next()
        }else{
            next(new error("You dont have permission to perform this action",403))
        }
    }
}

exports.forgotPassword=(catchAsync( async (req,res,next)=>{
    const email=req.body.email
    const user=await User.findOne({"email":email})
    console.log(user)
    if(!user){
        return next(new error("no user provided for the given email", 400))
    }
    const token=user.createPasswordToken();
    console.log(token)
    await user.save({validateBeforeSave:false})
    const resetLink=req.protocol+"://"+req.hostname+"/api/v1/resetPassword/"+token;
    console.log(resetLink)  
    const emailOptions={
        email:user.email,
        subject:"Password reset token valid for 10mins",
        message:`<html><p>click on the following link to reset your password</p><a href="${resetLink}">Reset</a> </html>`
    }
    try{
    await sendMail(emailOptions)
    res.status(200).json({
        status:'success',
        message:'reset link has been sent to your Email'
    })
    }catch{
        user.passwordResetExpires=undefined
        user.passwordResetToken=undefined
        user.save({validateBeforeSave:false})
        return next(new error("cannot send email",500))
    }

}))

exports.resetPassword=(catchAsync(async(req,res,next)=>{
    const token=getHashedToken(req.params.token)
    const user=await User.findOne({"passwordResetToken":token})
    if(!user){
        return next(new error('Not a valid token',403))
    }
    console.log(user.passwordResetExpires.getTime())
    if(user.passwordResetExpires.getTime()<=Date.now()){
        return next(new error('Time expired to reset password',403))
    }
    if(!req.body.password || req.body.repeatpassword){
        return next(new error('please specify password correctly',403))

    }
    user.password=req.body.password
    user.repeatPassword=req.body.repeatpassword
    user.passwordChangerAt=Date.now()
    user.passwordResetToken=undefined
    user.passwordResetExpires=undefined
    await user.save({validateBeforeSave:false})
    const jwttoken=jwtSignin(user)
    res.json({
        status:'success',
        message:'Successfuly loggedin user... Logged In',
        token:jwttoken
    })

}))

exports.updatePassword=(catchAsync(async(req,res,next)=>{
    const{currentPassword,newPassword,repeatPassword}=req.body
    console.log(currentPassword,newPassword,repeatPassword)
    if(! currentPassword && newPassword && repeatPassword){
       return next(new error('Please provide all the parameter correctly',400))
    }
    if(newPassword !== repeatPassword){
        return next(new error('password is not matching with repeatPassword',400))
     }
    const isValid=await req.user.passwordCompare(currentPassword,req.user.password)
    console.log(isValid) 
    if(! isValid){
        return next(new error('current password is not matching',400))

    }
    req.user.password=newPassword
    req.user.passChangedAt=Date.now()
    req.user.save({validateBeforeSave:false})
    const token=jwtSignin(req.user)
    res.json({
        "status":"success",
        "token":token
    })
}))