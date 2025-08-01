const express = require('express');
const {userAuth} = require('../middlewares/auth')
const profileRouter = express.Router()
const {validateProfileEditData} = require('../utils/validations')

profileRouter.get("/profile/view", userAuth, async(req, res)=>{
    try{
        const user = req.user;
        res.send(user)
    }
    catch(err){
        res.send("Err", err)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        
        //loggedInUser.firstName = req.body.firstName; Bad way

        Object.keys(req.body).forEach(key=> loggedInUser[key]=req.body[key]);

        console.log(loggedInUser);

        await loggedInUser.save();

        res.json({
            message: "Profile updatation success",
            data: loggedInUser
        });
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: err.message });
    }
});

// create /profile/forgotPassword 


module.exports = profileRouter;