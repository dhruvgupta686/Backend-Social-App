const validator = require('validator')

const ValidateSignUpData = (req) => {

    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid, please enter the name....")
    }
    // else if(firstName.length<4 || firstName.length>50){
    //     throw new Error("First name should be 4 to 50 characters")
    // }  as you have checks on db also, you can skip it 
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid!")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password")
    }

}

const validateProfileEditData = (req) =>{
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoURL", "gender", "age", "about", "skills"]

    const isEditAllowed = Object.keys(req.body).every(field=>allowedEditFields.includes(field));



    return isEditAllowed




}

module.exports = {
    ValidateSignUpData,
    validateProfileEditData
};