const path = require('path');
const fs = require('fs');
const Tour = require('../models/tourModel');
const Features=require('../utils/apiFeatures')
const asyncCatch=require('../utils/catchAsync')
const ErrorHandler=require('../utils/errorHandler')
//const tourdata=JSON.parse(fs.readFileSync(path.join(__dirname,'../dev-data/data/tours-simple.json'),'utf-8'));

exports.aliasRoute = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  next();
};



exports.getAllTour = asyncCatch(async (req, res, next) => {
  //try {
    //for selectingg few fields
    // console.log(JSON.parse(fdbQuery))
    // let reqFields={}
    // if(this.queryString.fields){
    //     fields=(this.queryString.fields).split(',')
    //     console.log(fields)
    //     fields.map((field)=>{
    //         reqFields[field]=1
    //     })
    // }
    // console.log(reqFields)
    ///sorting

    ///limiting
    ///specifing fields
    const features = new Features(Tour.find(), req.query)
      .filters()
      .sort()
      .paginate()
      .selectFields()

    const tours = await features.query;

    res.json({
      status: 'success',
      Reqdate: req.getReqDate,
      data: { tours },
    });
  // } catch (err) {
  //   console.log(err);
  //   res.status(404).json({
  //     status: 'fail',
  //     data: null,
  //   });
  // }
})

exports.setNewTour = asyncCatch(async (req, res,next) => {
  // try {
    console.log('hello get settour')
    const addedtour = await Tour.create(req.body);
    res.json({
      status: 'success',
      data: {
        addedtour,
      },
    });
  // } catch (err) {
  //   console.log(err);
  //   res.status(400).json({
  //     status: 'fail',
  //     data: err,
  //   });
  // }
});
exports.getTour = asyncCatch(async (req, res, next) => {
    console.log('hello get tour')
    const tour = await Tour.findById(req.params.id);
    console.log(tour)
    if(tour){
      res.json({ status: 'success', data: { tour } });
    }
    next(new ErrorHandler('cannot  id',404))
  });

exports.updateTour = asyncCatch(async function(req, res, next){
  // try {
    console.log('hello up tour')
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,runValidators:true
    });
    res.json({ status: 'success', data: { updatedTour } });
  // } catch (err) {
  //   console.log(err);
  //   res.status(404).json({ status: 'fail', data: null });
  // }
});
exports.deleteTour = asyncCatch(async (req, res, next) => {
  // try {
    console.log('hello delete tour')
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     data: null,
  //   });
  // }
});


exports.statsFind=asyncCatch(async (req,res, next)=>{
        const stats=await Tour.aggregate([
            {$group:{
                _id:"$difficulty",
                numOfTours:{$sum:1},
                avgPrice:{$avg:"$price"},
                minPrice:{$min:"$price"},
                maxPrice:{$max:"$price"},
            }}
        ])
        res.status(200).json({ status: 'success', data: stats });
      // } catch (err) {
      //     console.log(err)
      //   res.status(400).json({
      //     status: 'fail',
      //     data: null,
      //   });
      // } 

})

exports.advStats=asyncCatch(async (req,res, next)=>{
        const stats=await Tour.aggregate([
            {$unwind:"$startDates"},
            {$group:{
                _id:{$month:"$startDates"},
                nooftours:{$sum:1},
                tours:{$push:"$name"}
            }},
            {$addFields:{month:"$_id"}},
            {$sort:{month:1}},
            {$project:{_id:0}}
        ])
        res.status(200).json({ status: 'success', data: stats });
      // } catch (err) {
      //     console.log(err)
      //   res.status(400).json({
      //     status: 'fail',
      //     data: null,
      //   });
      // } 

})