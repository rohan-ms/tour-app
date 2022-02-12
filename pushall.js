const dotenv=require('dotenv')
dotenv.config({path:"./config.env"})
const mongoose=require('mongoose')
const fs=require('fs')
const Tour = require('./models/tourModel')
const User = require('./models/userModel')

const allData=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`))
const allUserData=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`))

//const DB=process.env.DATABASE.replace('<PASS>', process.env.PASSWORD)
//console.log(DB)

const DB=process.env.DBLOCAL



mongoose.connect(DB).then(()=>{
    console.log('connected to database successfuly')
}).catch((err)=>{
    console.log(err)
})

const deleteall=async ()=>{
await Tour.deleteMany()
console.log("Deleted all data")
process.exit()
}

async function importall() {
    try{
        await Tour.insertMany(allData)
    console.log("imported all data")
    process.exit()
    }catch(err){
        console.log(err)
    }
}

const deleteuser=async ()=>{
    await User.deleteMany()
    console.log("Deleted all user data")
    process.exit()
    }
    
    async function importuser() {
        try{
            await User.insertMany(allUserData)
        console.log("imported all user data")
        process.exit()
        }catch(err){
            console.log(err)
        }
    }

console.log(process.argv)
if(process.argv[2]==='--import'){
    importall()
}else if(process.argv[2]==='--delete'){
    deleteall()
}else if(process.argv[2]==='--importuser'){
    importuser()
}else if(process.argv[2]==='--deleteuser'){
    deleteuser()
}