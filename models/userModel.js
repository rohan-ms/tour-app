const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')
const crypto=require('crypto')
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'tell us your name']
    },
    email:{
        type:String,
        required:[true,'please provide your email'],
        unique:[true,'user already exist'],
        lowercase:true,
        validate:{
            validator: function (val){
                const pat=/[a-z0-9._]+@[a-z.]+\.[a-z]{2}[a-z]*/
                return pat.test(val)
            },
            message:'Please enter a valid email'
        }
    },
    photo:{
        type:String,
    },
    password:{
        type:String,
        required:[true,'please enter for password'],
        minlength:[8,'Password should have minimum 8 characters'],
    },
    repeatPassword:{
        type:String,
        select:false,
        required:[true,'please repeat password'],
        validate:{
            validator: function(val) {
                return val===this.password                
            },
            message:"passwords are not same"
        }
    },
    passChangedAt:Date,
    role:{
        required:true,
        type:String,
        default:'user',
        enum:{
            values:['admin','user','guide','lead-guide'],
            message:"Role can be on of the following 'admin','user','guide','lead-guide'"
        }
    },
    passwordResetExpires:Date,
    passwordResetToken:String,
    active:{
        type:Boolean,
        default:true,
        select:false
    }

},{toJSON:{virtuals:true},toObject:{virtuals:true}})
userSchema.pre('save', async function(next){
    this.password=await bcrypt.hash(this.password,12);
    this.repeatPassword=undefined;
    next()
})

userSchema.methods.passwordCompare=(candidatePass,userPass)=>{
    return bcrypt.compare(candidatePass,userPass);   
}

userSchema.methods.changedPass=function(itime){
    if(this.passChangedAt){
        passChangedTime=parseInt(this.passChangedAt.getTime()/1000,10)
        console.log(itime,passChangedTime)
        return itime<passChangedTime
    }

    return false
}
userSchema.methods.createPasswordToken=function(){
    this.passwordResetExpires=Date.now() + 1000 * 60 * 10
    const token=crypto.randomBytes(32).toString('hex')
    this.passwordResetToken=crypto.Hash('sha256').update(token).digest('hex');
    return token
}
userSchema.pre(/^find/,function (next){
    this.find({active:{$ne:false}})
    next()
})
const User=mongoose.model('users',userSchema)

module.exports=User