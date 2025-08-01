const jwt = require('jsonwebtoken');
const User = require('../models/user');


const userAuth = async(req, res, next)=>{

    try{
    //job of this middleware is to read the token from the req cookies 
    
    const cookies = req.cookies;
    const {token} = cookies;    //or write directly 

    if(!token){
        return res.status(401).send("You're not logged in")
    }

    const decodedObj = await jwt.verify(token, "DEV@Tinder$790")
    
    //validate the token and find the user (Does the user exists in the db?) 
    //in future we do it as PROCESS.ENV.SECRETKEY


    const {_id} = decodedObj;

    const user = await User.findById(_id);


    if(!user){
        throw new Error("User not found");
    }

    //attaching user to request 
    req.user = user;

    next(); //to get to the request handler 
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }


};

module.exports = {
    userAuth
}