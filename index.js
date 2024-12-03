import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"


dotenv.config()
const app = express()
const port =  process.env.PORT
const databaseURL =  process.env.DATABASE_URL
app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","PUT","POST","PATCH","DELETE"],
    credentials:true
}))
app.use("/uploads/profiles",express.static("/uploads/profiles"))
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRoutes)

const server =  app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})

mongoose.connect(databaseURL)
.then(()=>console.log("Database connected successfully"))
.catch(err=>console.log(err.message))