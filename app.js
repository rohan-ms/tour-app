const express=require('express');
const path=require('path')
const morgan = require('morgan');
const { tourRouter }=require('./routes/tourRoutes')
const userRouter =require('./routes/userRoutes')
const viewRouter =require('./routes/viewRoutes')
const error=require('./utils/errorHandler')
const errorCatcher=require('./controllers/errorCatcher')
const rateLimit=require('express-rate-limit')
const helmet=require('helmet')
const xss=require('xss-clean')
const mongoSanitize=require('express-mongo-sanitize')

//console.log(userRouter)
//console.log(process.env.NODE_ENV)
const app=express();

app.set('view engine','pug')
app.set('views', path.resolve(__dirname,'views'))

app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.use(express.json())
if(process.env.NODE_ENV==='development'){
app.use(morgan('dev'))}
app.use(express.static(path.resolve(__dirname,'public')))

app.use((req,res,next)=>{
    req.getReqDate=new Date().toISOString();
    next();
})

const limit=rateLimit({
    max:5,
    windowMs:60*60*1000,
    message:'too many request please try after some time'
})

app.use('/api',limit)
///////////////USER Routes//////////////////////////////

// app.get('/api/v1/tours',getAllTour);
// app.post('/api/v1/tours',setNewTour);
// app.get('/api/v1/tours/:id/:field?',getTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);
app.use('/',viewRouter)
app.use('/api/v1/tours',tourRouter)


app.use('/api/v1/users',userRouter)
app.all('*',function errorhand(req,res,next){
    // // res.json({
    // //     status:"fail",
    // //     message:"cannot find the requested route"
    // const err=new Error('cannot find the required route')
    // err.code=404
    // err.status='fail'
    // next(err)
        next(new error('Requested route doesn\'t exist',404))
    })

app.use(errorCatcher)
module.exports=app