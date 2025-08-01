const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
//creation of user schema 

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20
    },
    lastName: {
        type: String
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email address" + value)
            }
        }
    },
    password:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        min: 3
    }, 
    gender: {
        type: String,
        enum:{
            values: ["male", "female", "other"],
            message: `{VALUE} is not a valid gender type`
        }
        // validate(value){
        //     if(!["male", "female", "others"].includes(value)){
        //         throw new Error("Gender is not valid")
        //     }
        // }
    },
    about: {
        type: String,
        default: "This is default about of the user"
    },
    skills: {
        type: [String],
    },
    photoURL: {
        type: String, 
        default: "https://sp-ao.shortpixel.ai/client/to_auto,q_glossy,ret_img,w_250/https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg"
    }

},
{
    timestamps: true
})


userSchema.methods.getJWT = async function(){
    const user = this;

    //this is referencing to the instances of the model

    const token  = await jwt.sign({_id: this._id}, "DEV@Tinder$790",{
                expiresIn:'12hr'
    });

    return token;
}
//we can't use arrow function here => break things up 
//this doesn't work in arrow function

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const pswdHashed = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, pswdHashed);

    return isPasswordValid;
}


module.exports = mongoose.model("User", userSchema);