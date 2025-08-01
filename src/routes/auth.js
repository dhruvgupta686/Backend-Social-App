const express = require('express');
const {ValidateSignUpData} = require("../utils/validations")
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user')

//const app = express()
//const authRouter = express.router();

//app.use() works like router.use();
//this works similar way to app.get, app.post etc.

authRouter.post('/signup', async(req, res)=>{

    try{
        
        ValidateSignUpData(req);

        const {firstName, lastName, emailId, password, age, about, gender} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({firstName, lastName, emailId, password: passwordHash, age, about, gender})

        const savedUser = await user.save();

        const token = await savedUser.getJWT();
        res.cookie("token", token, {
                expires: new Date(Date.now()+8*3600000),
        });

        res.json({
            message:"User Added Successfully", 
            data: savedUser
        });



    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
   
})

// in companies they directly write it router = express.Router()

authRouter.post('/login', async(req, res)=>{

    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Please check credentials")
        }

        

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            
            //user is now akshay (instance)

            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now()+8*3600000),
                // httpOnly: true,     
                // secure: true
            });
            
            res.send(user);
        }
        else{
            throw new Error("Please check credentials")
        }


    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
   
})

authRouter.post('/logout', async(req, res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logout Successful");
})


module.exports = authRouter;

