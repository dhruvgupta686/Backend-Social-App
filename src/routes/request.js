const express = require('express');
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res)=>{
    try{
        const fromUserId = req.user._id;

        const toUserId = req.params.toUserId;
        
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid Status Type: "+status});
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({
                message: "User not found"
            })
        }
     
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [{fromUserId: fromUserId, toUserId: toUserId}, 
                {fromUserId: toUserId, toUserId: fromUserId}]
        });
        if(existingConnectionRequest){
            return res.status(400).send({
                message: "Connection Request Already Exists"
            })
        }

        //save connection request => New instance of the model 
        const connectionRequest = new ConnectionRequest({
            fromUserId, 
            toUserId, 
            status
        })

        const data = await connectionRequest.save();    //saving in db 
        //we can send res.json also, instead of res.send
        res.json({
            message: req.user.firstName+" is "+ status + 
            " in " + toUser.firstName, 
            data
        });
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
   
})

requestRouter.post("/request/review/:status/:requestId", 
    userAuth,
    async(req, res)=>{
        try{
            const loggedInUser = req.user;
            const {status, requestId} = req.params;

            const allowedStatus = ["accepted", "rejected"];
            if(!allowedStatus.includes(status)){
                return res.status(400).json({
                    message:"Status is not valid/allowed"
                })
            }
            
            //finding req in db, which has valid reqId, toUser, status 
            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested"
            })

            if(!connectionRequest){
                return res.status(404).json({
                    message: "Connection Request not found"
                })
            }

            //now it's safe to modify the status 

            connectionRequest.status = status;

            const data = await connectionRequest.save();

            res.json({
                message: "Connection Request "+ status, 
                data
            })

        }catch(err){
            res.status(400).send("Error: "+err.message);
        }
    
})

module.exports = requestRouter;