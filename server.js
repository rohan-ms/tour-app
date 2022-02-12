const dotenv=require('dotenv')
dotenv.config({path:"./config.env"})
const mongoose=require('mongoose')
const app=require('./app')


//const DB=process.env.DATABASE.replace('<PASS>', process.env.PASSWORD)
//console.log(DB)
//local DB
const DB=process.env.DBLOCAL

mongoose.connect(DB).then(()=>{
    console.log('connected to database successfuly')
}).catch((err)=>{
    console.log(err)
})


const port = 5000
const server=app.listen(port,()=>{
    console.log('listining on port 5000')
})

// server.on('')