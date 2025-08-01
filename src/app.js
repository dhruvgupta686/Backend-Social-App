const express = require('express');
require('./config/database')
const connectDB = require('./config/database')
const app = express(); 
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));






app.use(express.json());
app.use(cookieParser());
//importing routes
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user');

//say api comes in /login it'll go to authRouter and check for all the routes and if the response is send from a particular route it won't go ahead 
//send response back from where it gets the first 

// app.use("/", authRouter)
// app.use("/", profileRouter)
// app.use("/", requestRouter)

app.use("/", authRouter, profileRouter, requestRouter, userRouter);

connectDB().then(()=>{
    console.log("DB Connection Success")
    app.listen(3000, ()=>{
        console.log("Server is running on port 3000");
    })
}).catch(err=>{console.log("Db cannot be connected")})



