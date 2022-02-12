const catchAsync=require('./../utils/catchAsync')
const Tour=require('./../models/tourModel')
const User=require('./../models/userModel')

exports.overview=(catchAsync(async (req,res)=>{
    tours=await Tour.find({})
    res.status(200).render('overview',{
        title:'All tours',
        tours
    })
}))

exports.tour=(catchAsync(async (req,res)=>{
    const id=req.params.id
    const tour=await Tour.findById({_id:id}).populate({
        path:'reviews',
        fields:'review rating user'
    })
    //console.log(tour.guides)
    console.log(tour.reviews)
    // const Allusers=tour.guides.map((guide)=>{ console.log(guide)
    //     return User.findOne({_id:`${guide}`})})
    // console.log(tour.guides[0])
    // let users=await User.findById({_id:tour.guides[0]})
    // console.log(users)
    res.status(200).render('tour',{
        tour
    })
    
}))

exports.getloginForm=((req,res)=>{
    res.status(200).render('login')
})