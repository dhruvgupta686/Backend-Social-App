const express = require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const User = require('../models/user');
const ConnectionRequest = require("../models/connectionRequest")
//finding all the conenction requests user has received (pending connection req)

const USER_SAFE_DATA = "firstName lastName photoURL age gender about skills"

userRouter.get("/user/requests/received", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        //from db you can get all objects 
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)
        //how to send user detail also 
        //one way is looping id and getting info


        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        })
    }
    catch(err){
        res.status(400).send("Error" + err.message);
    }
})


userRouter.get("/user/connections", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;

        //status of accepted 
        //we will check the logged in user is fromuserId or touserId 

        const connectionRequests = await ConnectionRequest.find({
            $or:[{
                toUserId: loggedInUser._id, 
                status: "accepted"
            }, 
        {
            fromUserId: loggedInUser._id, 
            status: "accepted"
        }]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)
        
        const data = connectionRequests.map((row)=> 
            {
                if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                    return row.toUserId
                }
                return row.fromUserId;
            });


        res.json({
            data
        })

    }catch(err){
        res.status(400).send({
            message:err.message
        })
    }
})


userRouter.get("/feed", userAuth, async(req, res)=>{
    try{
    
        const loggedInUser = req.user;

        const page = parseInt(req.query.page)||1;
        let limit = parseInt(req.query.limit)||10;

        limit = limit>50?50:limit; //for large query (Sanitization)

        //if someone sends "xyz" won't parse dw 

        //setting defaults 
        // "/feed?page=2&limit=100"

        const skipCount = (page-1)*limit;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {
                    fromUserId: loggedInUser._id
                }, 
                {
                    toUserId: loggedInUser._id
                }
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
            $and: [{_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}]
        }).select(USER_SAFE_DATA).skip(skipCount).limit(limit);



        res.send(users);


    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
})

module.exports = userRouter;