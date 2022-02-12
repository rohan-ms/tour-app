const error=require('../utils/errorHandler')
function isCasterror(err,next){
    console.log("htllo")
    const message=`cannot find ${err.value} at ${err.path}`
    return new error(message,404)

}
function isDuplicate(err,next){
    const value=err.message.match(/["'].*["']/)[0]
    const message=`duplicate value ${value}`
    return new error(message,400)  
}

function sendDevError(err,res){
    errCode= err.statusCode || 500
    errstatus= err.status || 'error'
    console.log(err.message)
    res.status(errCode).json({
        status:errstatus,
        message:err.message,
        errstack:err

    })
}
function sendProdError(err,res){
    errCode= err.statusCode || 500
    errstatus= err.status || 'error'
    if(err.isOperational){
        res.status(errCode).json({
            status:errstatus,
            message:err.message
    
        })}
        else{
            res.status(errCode).json({
                status:'error',
                message:"somthing went wrong"
            })
        }
}
function isValidator(err) {
    let message=Object.values(err.errors).map((el)=>{return el.message})
    console.log(message)
    const errMsg=message.join('. ') 
    return new error(message,404)
}
const errorCatcher=(err,req,res,next)=>{
    
    if(process.env.NODE_ENV==='development'){
        //console.log(err.message,newerror.message)
        console.log(err)
       sendDevError(err,res);
    }else if(process.env.NODE_ENV==='production'){
        let newerror;
        if(err.name==="CastError"){
           newerror =isCasterror(err)
         }
         if(err.code===11000){
            newerror=isDuplicate(err)
         }
         if(err.name="ValidatorError"){
            newerror=isValidator(err)
         }
         const errors= newerror || err
         sendProdError(errors,res)
        
    }
}

module.exports=errorCatcher