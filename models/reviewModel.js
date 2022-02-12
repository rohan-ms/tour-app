const mongoose=require('mongoose')
const User=require('./userModel')
const Tour=require('./tourModel')
const reviewSchema=mongoose.Schema({
    review:String,
    rating:Number,
    user:{
        type:String,
        ref:User
    },
    tour:{
        type:String
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
)

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'user',
        select:'name photo'
    })
    // .populate({
    //     path:'tour',
    //     select:'name'
    // })
    // console.log("passed")
    next()
})
const ReviewModel=mongoose.model('Reviews',reviewSchema)

module.exports=ReviewModel