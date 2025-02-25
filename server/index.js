import express from "express"
import morgan from "morgan";
import dotenv from "dotenv";
import {rateLimit} from "express-rate-limit"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
import cookieParser from "cookie-parser"
import cors from "cors"
import hpp from "hpp"

dotenv.config()

const app = express()
const PORT = process.env.PORT

//Global rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: "To many request from this IP, please try later"
})

//security middleware
app.use("/api", limiter)
app.use(helmet())
app.use(hpp())
app.use(mongoSanitize())



//logging middelware
if(process.env.NODE_ENV === "devlopment"){
    app.use(morgan('dev'))
}



//Body parse middleware
app.use(express.json({limit: '10kb'}))
app.use(express.urlencoded({limit: '10kb', extended: true}))
app.use(cookieParser())


//global error handler
app.use((err, req, res, next)=>{
    console.error(err.stack)
    res.status(err.status || 500).json(
        {
            status: "error",
            message: err.message || "Internal server error", 
            ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
        }
    )
})



//CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials:true,
    methods:["GET", "POST", "PUT", "DLETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "device-remember-token",
        "Access-control-Allow-Origin",
        "Origin",
        "Accept"
    ]
}))



//404 Route Handler
app.use((req, res)=>{
    res.status(404).json(
        {
            status: "Error",
            message: "Route not found"
        }
    )
})
app.listen(PORT,()=>{
    console.log(`Server is listening on PORT: ${PORT} in ${process.env.NODE_ENV} mode`)
})
