const mongoose=require('mongoose');
const Review=require('./reviewModel')
const User=require('./userModel')

const tourSchema=mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'name is required'],
        trim:true,
        maxlength:[50,'name can have max 50 in length']
    },
    duration:{
        type:Number,
        default:6
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:1,
        max:5
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:true
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have maxGroupSize']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have difficulty'],
        enum:{
            values:['easy','medium','difficult'],
            message:'difficulty can be easy, medium or hard'
        }
    },
    startLocation:Object,
    summary:{
        type:String,
        required:[true,'A tour must have summary']
    },
    description:{
        type:String,
        required:[true,'A tour must have discription']
    },
    guides:[
        {
        type:mongoose.Schema.ObjectId,
        ref:'users'
        }

    ],
    images:[String],
    imageCover:String,
    startDates:[Date],
    createdAt:{
        type:Date,
        default:Date.now()
    }
    
    

},{toJSON:{virtuals:true},toObject:{virtuals:true}});
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7
})
tourSchema.virtual('reviews',{
ref:'Reviews',
foreignField:'tour',
localField:'_id'

})

// tourSchema.pre('find', function (next) {
//     this.find({difficulty:{$ne:"difficult"}})
//     next()
    
// })
tourSchema.pre(/^find/, function (next) {
    this.populate({
        path:'guides',
        select:'-__v'
    })
    next()
    
})
tourSchema.post('find', function (docs,next) {
    docs.map((doc)=>{
        return doc.price=(doc.price-((doc.price/100)*20))
    })
    
    next()
})
const TourMod=mongoose.model('Tour',tourSchema);


module.exports=TourMod